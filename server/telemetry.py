from mavcore import MAVDevice
from mavcore.messages import VFRHUD, GlobalPosition, Heartbeat, BatteryStatus, GPSRaw, MAVState, Attitude, StatusText, MAVSeverity, FlightMode, IntervalMessageID
from mavcore.protocols import HeartbeatProtocol, SetModeProtocol, RequestMessageProtocol
import time

class Telemetry:
    def __init__(self) -> None:
        self.device = MAVDevice("udp:127.0.0.1:14550")

        self.BUFFER_SIZE = 5
        self.heartbeat_timestamps = []
        self.msg_id = 0
        self.heartbeat_id = 0

        self.msg_buffer = ""

        self.mission_plan = {"waypoints": [], "geofence": {"name": "", "points": []}}

    def update(self):
        ## protocols
        self.hb_protocol = self.device.run_protocol(HeartbeatProtocol())

        # listeners
        self.vfr = VFRHUD()
        self.global_pos = GlobalPosition()
        self.heartbeat = Heartbeat(self.heartbeat_cb)
        self.batt = BatteryStatus()
        self.gps = GPSRaw()
        self.attitude = Attitude()
        self.status_text = StatusText("", MAVSeverity.INFO, self.msg_cb)
        self.device.add_listener(self.vfr)
        self.device.add_listener(self.global_pos)
        self.device.add_listener(self.heartbeat)
        self.device.add_listener(self.batt)
        self.device.add_listener(self.gps)
        self.device.add_listener(self.attitude)
        self.device.add_listener(self.status_text)

    def get_state(self) -> dict:
        msg_to_send = self.msg_buffer
        self.msg_buffer = ""
        return {'timestamp': time.time() * 1000.0,
                'batterySoc': self.batt.soc,
                'armed': self.heartbeat.isArmed(),
                'estopOn': True,
                'mode': self.heartbeat.mode.name,
                'currentLat': self.global_pos.lat,
                'currentLon': self.global_pos.lon,
                'heading': self.vfr.heading_int,
                'altitude': self.global_pos.alt_relative,
                'throttle': self.vfr.throttle,
                'speed': (self.vfr.climbspeed**2+self.global_pos.vx**2+self.global_pos.vy**2)**0.5,
                'groundspeed': 2.0,
                'climbspeed': 5.0,
                'roll': self.attitude.roll * 180.0 / 3.1415,
                'pitch': self.attitude.pitch * 180.0 / 3.1415,
                'heartbeat': self.heartbeat_id,
                'hb_hz': f"{self.calculate_hz():.2f} hz",
                'status': msg_to_send,
                'telemConnected': True,
                'jetsonConnected': True,
                'bottleDropped': False,
                'beaconDropped': False,
                'accelerometer': 0,
                'compass': 1,
                'level': 2,
                'barometer': 0,
                'cameraTest': 1,
                'payloadTest': 2,
                'pdbTest': 0,
                'pdbTest': 0,
                'laps': 0,
                'lapDist': 0,
                'total': 0,
                'waypoints': 0,
                'geofenceEnabled': 0,
                'armScript': 0
                }

    def heartbeat_cb(self, mavMsg):
        self.heartbeat_id += 1
        self.heartbeat_timestamps.insert(0, mavMsg.timestamp)
        if len(self.heartbeat_timestamps) > self.BUFFER_SIZE:
            self.heartbeat_timestamps.pop()

    @staticmethod
    def calculate_avg(l: list) -> float:
        Sum = 0.0
        for i in range(len(l) - 1):
            Sum += l[i] - l[i + 1]
        return Sum / (len(l) - 1)
    
    def calculate_hz(self) -> float:
        if len(self.heartbeat_timestamps) > 1:
            avg = self.calculate_avg(self.heartbeat_timestamps)
            if avg < time.time() - self.heartbeat_timestamps[0]:
                avg = self.calculate_avg([time.time(), *self.heartbeat_timestamps])
            return 1.0 / avg
        else:
            return -1.0
    
    def msg_cb(self, msg):
        self.msg_buffer += msg.text + "\n"

    def set_mode(self, mode_str: str):
        try:
            mode = FlightMode[mode_str.upper()]
        except:
            mode = FlightMode.RTL
            
        set_mode_protocol = SetModeProtocol(mode)
        self.device.run_protocol(set_mode_protocol)
        print(set_mode_protocol.ack_msg)


    



    
