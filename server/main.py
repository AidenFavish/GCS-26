from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import time
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import asyncio
import contextlib
from telemetry import Telemetry

telem = Telemetry()

class ModeBody(BaseModel):
    mode: str

class ChecklistBody(BaseModel):
    section: str
    item: str

class ArmScriptBody(BaseModel):
    timestamp: str

class WaypointBody(BaseModel):
    latitude: float
    longitude: float
    altitude: float | None = 0.0

class GeofencePointBody(BaseModel):
    lat: float
    lon: float

class GeofenceBody(BaseModel):
    name: str = ""
    points: list[GeofencePointBody] = Field(default_factory=list)

class PlanBody(BaseModel):
    waypoints: list[WaypointBody] = Field(default_factory=list)
    geofence: GeofenceBody | None = None

websocket_connections: list[WebSocket] = []

# Manage background tasks using FastAPI lifespan (on_event deprecated)
loop_task: asyncio.Task | None = None

async def lifespan(app: FastAPI):
    global loop_task
    # Start the broadcast loop within the server's event loop
    loop_task = asyncio.create_task(main_loop())
    try:
        yield
    finally:
        if loop_task is not None:
            loop_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await loop_task
            loop_task = None

app = FastAPI(lifespan=lifespan) # type: ignore

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your iPad's IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/api/mode")
def set_mode(body: ModeBody) -> dict:
    telem.set_mode(body.mode)
    return {"ok": True, "mode": body.mode}


@app.post("/api/checklist")
def checklist(body: ChecklistBody) -> dict:
    global device
    pass  # TODO implement checklist check and implementation
    print(body.item + " recieved")

    return {"ok": True, "mode": body.item}


@app.post("/api/arm-script")
def armScript(body: ArmScriptBody) -> dict:
    global device
    pass  # TODO implement arm script check and implementation
    print(body.timestamp + " arm script recieved")

    return {"ok": True, "timestamp": body.timestamp}


@app.post("/api/plan")
def set_plan(body: PlanBody) -> dict:
    mission_plan = {
        "waypoints": [
            {
                "latitude": wp.latitude,
                "longitude": wp.longitude,
                "altitude": wp.altitude if wp.altitude is not None else 0.0,
            }
            for wp in body.waypoints
        ],
        "geofence": {
            "name": body.geofence.name if body.geofence else "",
            "points": [
                {"lat": pt.lat, "lon": pt.lon}
                for pt in (body.geofence.points if body.geofence else [])
            ],
        },
    }
    telem.mission_plan = mission_plan
    return {
        "ok": True,
        "waypoints": len(mission_plan["waypoints"]),
        "geofence": mission_plan["geofence"]["name"],
    }


@app.get("/api/plan")
def get_plan() -> dict:
    return telem.mission_plan


@app.websocket("/telemetry")
async def ws_telemetry(ws: WebSocket):
    await ws.accept()
    websocket_connections.append(ws)
    try:
        # Keep the connection open; client may not send messages.
        while True:
            await ws.receive()
    except WebSocketDisconnect:
        pass
    finally:
        if ws in websocket_connections:
            websocket_connections.remove(ws)

@app.get("/")
def root():
    return {"message": "hello!"}

async def broadcast() -> None:
        if not websocket_connections:
            return
        payload = telem.get_state()
        # Send to all; drop dead sockets
        dead: list[WebSocket] = []
        for ws in websocket_connections:
            try:
                await ws.send_json(payload)
            except WebSocketDisconnect:
                dead.append(ws)
            except Exception:
                dead.append(ws)
        for ws in dead:
            websocket_connections.remove(ws)


async def main_loop():
    while True:
        await broadcast()
        await asyncio.sleep(1.0)
