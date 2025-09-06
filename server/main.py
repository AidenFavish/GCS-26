from __future__ import annotations

import asyncio
import math
import time
from dataclasses import asdict, dataclass
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


@dataclass
class Telemetry:
    timestamp: float
    batterySoc: float
    armed: bool
    estopOn: bool
    mode: str
    currentLat: float
    currentLon: float
    heading: float
    altitude: float
    throttle: float
    speed: float
    roll: float
    pitch: float
    heartbeat: int
    status: str


class ModeBody(BaseModel):
    mode: str


class Hub:
    def __init__(self) -> None:
        self.clients: List[WebSocket] = []
        self.mode = "GUIDED"
        # seed values around SF
        self.state = Telemetry(
            timestamp=time.time() * 1000.0,
            batterySoc=92.0,
            armed=False,
            estopOn=True,
            mode=self.mode,
            currentLat=37.7749,
            currentLon=-122.4194,
            heading=45.0,
            altitude=120.0,
            throttle=30.0,
            speed=12.0,
            roll=5.0,
            pitch=-2.0,
            heartbeat=0,
            status="Status #0",
        )
        self._t = 0

    async def add(self, ws: WebSocket) -> None:
        await ws.accept()
        self.clients.append(ws)

    def remove(self, ws: WebSocket) -> None:
        if ws in self.clients:
            self.clients.remove(ws)

    def set_mode(self, mode: str) -> None:
        self.mode = (mode or "").upper() or "OTHER"

    def _smooth(self, step: float = 1.0) -> float:
        # simple bounded noise
        import random

        return (random.random() * 2 - 1) * step

    def _wrap360(self, v: float) -> float:
        n = v % 360.0
        return n + 360.0 if n < 0 else n

    def _clamp(self, v: float, lo: float, hi: float) -> float:
        return max(lo, min(hi, v))

    def step(self) -> None:
        self._t += 1
        s = self.state
        heading = self._wrap360(s.heading + 2 + self._smooth(0.8))
        altitude = self._clamp(s.altitude + math.sin(self._t / 10) * 2 + self._smooth(0.8), 0, 5000)
        throttle = self._clamp(s.throttle + self._smooth(3), 0, 100)
        speed = self._clamp(s.speed + math.sin(self._t / 8) * 0.4 + self._smooth(0.5), 0, 60)
        roll = self._clamp(s.roll + math.sin(self._t / 12) * 1.2 + self._smooth(0.6), -45, 45)
        pitch = self._clamp(s.pitch + math.cos(self._t / 14) * 0.6 + self._smooth(0.4), -20, 20)
        battery = self._clamp(s.batterySoc - 0.02 + self._smooth(0.05), 0, 100)

        # flip states occasionally
        import random

        armed = not s.armed if random.random() < 0.02 else s.armed
        estop = not s.estopOn if random.random() < 0.02 else s.estopOn

        # integrate position using speed/heading
        meters = speed
        rad = math.radians(heading)
        d_north = meters * math.cos(rad)
        d_east = meters * math.sin(rad)
        meters_per_deg_lat = 111_320.0
        lat_rad = math.radians(s.currentLat)
        meters_per_deg_lon = max(1.0, math.cos(lat_rad) * 111_320.0)
        dlat = d_north / meters_per_deg_lat
        dlon = d_east / meters_per_deg_lon
        lat = self._clamp(s.currentLat + dlat, -90, 90)
        lon = s.currentLon + dlon

        self.state = Telemetry(
            timestamp=time.time() * 1000.0,
            batterySoc=battery,
            armed=armed,
            estopOn=estop,
            mode=self.mode,
            currentLat=lat,
            currentLon=lon,
            heading=heading,
            altitude=altitude,
            throttle=throttle,
            speed=speed,
            roll=roll,
            pitch=pitch,
            heartbeat=s.heartbeat + 1,
            status=f"Status #{s.heartbeat + 1}",
        )

    async def broadcast(self) -> None:
        if not self.clients:
            return
        payload = asdict(self.state)
        # Send to all; drop dead sockets
        dead: List[WebSocket] = []
        for ws in self.clients:
            try:
                await ws.send_json(payload)
            except WebSocketDisconnect:
                dead.append(ws)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.remove(ws)


hub = Hub()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/api/mode")
def set_mode(body: ModeBody) -> dict:
    hub.set_mode(body.mode)
    return {"ok": True, "mode": hub.mode}


@app.websocket("/ws/telemetry")
async def ws_telemetry(ws: WebSocket):
    await hub.add(ws)
    try:
        while True:
            # simple keepalive: step + broadcast every 1s
            hub.step()
            await hub.broadcast()
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        hub.remove(ws)


# To run:
#   pip install fastapi uvicorn
#   uvicorn server.main:app --reload --port 8000

