import React from "react";

const DEVICES = [
  { name: "OP-7-KYOTO-004", type: "TEMP/HUM", value: "24.3°C", online: true, signal: 4, battery: 88 },
  { name: "OP-7-LAGOS-011", type: "SOIL MOIST", value: "61%", online: true, signal: 3, battery: 54 },
  { name: "OP-7-OSLO-002", type: "AIR QUALITY", value: "AQI 32", online: true, signal: 4, battery: 92 },
  { name: "OP-7-AUSTIN-019", type: "MOTION", value: "IDLE", online: false, signal: 0, battery: 12 },
  { name: "OP-7-PUNE-007", type: "PRESSURE", value: "1013 hPa", online: true, signal: 2, battery: 67 },
  { name: "OP-7-QUITO-014", type: "LIGHT", value: "812 lx", online: true, signal: 3, battery: 79 },
];

export function DeviceGrid() {
  return (
    <div className="dg-grid">
      <style>{`
        .dg-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .dg-card{
          background:var(--panel-beige); border:2px solid var(--ink); border-radius:8px;
          padding:14px; box-shadow:4px 4px 0 rgba(0,0,0,0.32); color:var(--ink);
        }
        .dg-card-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        .dg-name{ font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:600; letter-spacing:0.02em; }
        .dg-status{ display:flex; align-items:center; gap:5px; }
        .dg-status-dot{ width:7px; height:7px; border-radius:50%; }
        .dg-status-dot.on{ background:var(--led-green); box-shadow:0 0 5px var(--led-green); animation:dg-blink 2s infinite; }
        .dg-status-dot.off{ background:#8a8073; }

        .dg-lcd{
          background:#c7dbc2; border:2px inset #8f9c87; border-radius:3px;
          padding:10px 10px 8px; margin-bottom:10px;
        }
        .dg-lcd-type{ font-family:'IBM Plex Mono',monospace; font-size:8.5px; letter-spacing:0.1em; color:#3a4a35; opacity:0.75; }
        .dg-lcd-value{ font-family:'VT323',monospace; font-size:30px; color:#233120; line-height:1.1; }

        .dg-foot{ display:flex; justify-content:space-between; align-items:center; }
        .dg-bars{ display:flex; align-items:flex-end; gap:2px; height:14px; }
        .dg-bar{ width:4px; background:#8f8567; border-radius:1px; }
        .dg-bar.active{ background:var(--teal); }
        .dg-batt{ font-family:'IBM Plex Mono',monospace; font-size:9px; opacity:0.7; }

        @keyframes dg-blink{ 0%,100%{opacity:1;} 50%{opacity:0.3;} }
      `}</style>
      {DEVICES.map((d) => (
        <div className="dg-card" key={d.name}>
          <div className="dg-card-head">
            <span className="dg-name">{d.name}</span>
            <span className="dg-status">
              <span className={`dg-status-dot ${d.online ? "on" : "off"}`} />
            </span>
          </div>
          <div className="dg-lcd">
            <div className="dg-lcd-type">{d.type}</div>
            <div className="dg-lcd-value">{d.value}</div>
          </div>
          <div className="dg-foot">
            <div className="dg-bars">
              {[1, 2, 3, 4].map((b) => (
                <span
                  key={b}
                  className={`dg-bar ${b <= d.signal ? "active" : ""}`}
                  style={{ height: `${b * 3 + 2}px` }}
                />
              ))}
            </div>
            <span className="dg-batt">BATT {d.battery}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const CODE = `# OUTPOST-7 :: node firmware (MicroPython)
import network, time, machine
from outpost import Uplink

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("YOUR_WIFI", "PASSWORD")

while not wlan.isconnected():
    time.sleep(0.5)

node = Uplink(device_id="OP-7-KYOTO-004", token="NODE_TOKEN")
node.connect("global.outpost.network")

sensor = machine.ADC(machine.Pin(34))

while True:
    reading = sensor.read()
    node.publish("telemetry", {"temp": reading})
    time.sleep(10)
`;

export function CodePanel() {
  const lines = CODE.split("\n");
  return (
    <div className="dg-paper-wrap">
      <style>{`
        .dg-paper-wrap{ position:relative; padding:0 26px; }
        .dg-holes{ display:flex; justify-content:space-between; padding:0 4px 6px; }
        .dg-holes.bottom{ padding:6px 4px 0; }
        .dg-hole{ width:8px; height:8px; border-radius:50%; background:var(--bg-deep); border:1px solid #5c5340; }
        .dg-paper{
          background:repeating-linear-gradient(var(--paper), var(--paper) 27px, #e3d8ba 28px);
          border:1px solid #a89c7c;
          border-radius:2px;
          padding:22px 26px;
          box-shadow:0 10px 24px rgba(0,0,0,0.35);
          overflow-x:auto;
        }
        .dg-code{
          font-family:'IBM Plex Mono',monospace; font-size:13px; line-height:28px;
          color:#3a3324; white-space:pre;
        }
        .dg-code .ln{ display:inline-block; width:22px; color:#a89c7c; user-select:none; }
      `}</style>
      <div className="dg-holes">
        {Array.from({ length: 18 }).map((_, i) => <span className="dg-hole" key={i} />)}
      </div>
      <div className="dg-paper">
        <div className="dg-code">
          {lines.map((line, i) => (
            <div key={i}><span className="ln">{String(i + 1).padStart(2, "0")}</span>{line}</div>
          ))}
        </div>
      </div>
      <div className="dg-holes bottom">
        {Array.from({ length: 18 }).map((_, i) => <span className="dg-hole" key={i} />)}
      </div>
    </div>
  );
}