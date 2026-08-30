import React, { useState } from "react";

// Rough flat-projection positions (percent) for a spread of global cities
const NODES = [
  { x: 18, y: 34, d: "0s" },
  { x: 47, y: 22, d: "0.4s" },
  { x: 74, y: 30, d: "0.9s" },
  { x: 30, y: 55, d: "1.3s" },
  { x: 58, y: 62, d: "0.2s" },
  { x: 84, y: 58, d: "1.7s" },
  { x: 12, y: 68, d: "2.1s" },
  { x: 65, y: 40, d: "0.6s" },
];

export default function RetroDevice() {
  const [switches, setSwitches] = useState([true, false, true, true, false]);

  function toggle(i) {
    setSwitches((s) => s.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="rd-console">
      <style>{`
        .rd-console{
          background:linear-gradient(160deg, var(--panel-beige), var(--panel-beige-dark));
          border:3px solid var(--ink);
          border-radius:18px;
          padding:20px 20px 24px;
          box-shadow:10px 12px 0 rgba(0,0,0,0.4);
          position:relative;
        }
        .rd-screw{
          position:absolute; width:9px; height:9px; border-radius:50%;
          background:#8c8067; box-shadow:inset 0 0 0 1px #5b5341, 0 0 0 1px #efe9d6;
        }
        .rd-screw.tl{ top:12px; left:12px; } .rd-screw.tr{ top:12px; right:12px; }
        .rd-screw.bl{ bottom:12px; left:12px; } .rd-screw.br{ bottom:12px; right:12px; }

        .rd-toprow{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:0 6px; }
        .rd-plate{ font-family:'Big Shoulders Stencil','Space Grotesk',sans-serif; font-size:13px; letter-spacing:0.14em; color:var(--ink); }
        .rd-leds{ display:flex; gap:10px; }
        .rd-led{ display:flex; align-items:center; gap:5px; }
        .rd-led-dot{ width:8px; height:8px; border-radius:50%; }
        .rd-led-label{ font-family:'IBM Plex Mono',monospace; font-size:8px; color:var(--ink); letter-spacing:0.06em; }
        .rd-led-dot.power{ background:var(--led-green); box-shadow:0 0 5px var(--led-green); }
        .rd-led-dot.uplink{ background:var(--crt-amber); box-shadow:0 0 5px var(--crt-amber); animation:rd-blink 1.4s infinite; }
        .rd-led-dot.sync{ background:#3ec7c7; box-shadow:0 0 5px #3ec7c7; animation:rd-blink 2.2s infinite; }

        .rd-screen{
          position:relative;
          background:var(--crt-screen);
          border:6px solid #171310;
          border-radius:8px;
          height:300px;
          overflow:hidden;
          box-shadow:inset 0 0 30px rgba(0,0,0,0.85);
        }
        .rd-grid{
          position:absolute; inset:0;
          background-image:
            repeating-linear-gradient(0deg, rgba(255,176,0,0.07) 0 1px, transparent 1px 34px),
            repeating-linear-gradient(90deg, rgba(255,176,0,0.07) 0 1px, transparent 1px 34px);
        }
        .rd-sweep{
          position:absolute; inset:-20%;
          background:conic-gradient(from 0deg, rgba(255,176,0,0.35), transparent 22%, transparent 100%);
          animation:rd-rotate 5s linear infinite;
          mix-blend-mode:screen;
        }
        .rd-node{
          position:absolute; width:6px; height:6px; margin:-3px;
          border-radius:50%; background:var(--crt-amber);
          box-shadow:0 0 6px var(--crt-amber);
          animation:rd-ping 2.6s ease-out infinite;
        }
        .rd-node::after{
          content:''; position:absolute; inset:-6px; border-radius:50%;
          border:1px solid var(--crt-amber); opacity:0;
          animation:rd-ringout 2.6s ease-out infinite;
        }
        .rd-scanlines{
          position:absolute; inset:0; pointer-events:none;
          background:repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px);
          animation:rd-flicker 6s infinite;
        }
        .rd-glass{
          position:absolute; inset:0;
          background:linear-gradient(115deg, rgba(255,255,255,0.06) 0%, transparent 30%);
          pointer-events:none;
        }
        .rd-readout{
          position:absolute; left:10px; bottom:8px;
          font-family:'VT323',monospace; font-size:20px; color:var(--crt-amber);
          text-shadow:0 0 6px rgba(255,176,0,0.6);
        }
        .rd-readout-label{
          position:absolute; right:12px; bottom:10px;
          font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--crt-amber-dim);
          letter-spacing:0.1em;
        }

        .rd-bottomrow{
          display:flex; align-items:center; justify-content:space-between;
          margin-top:16px; padding:0 6px;
        }
        .rd-switches{ display:flex; gap:10px; }
        .rd-switch{
          width:22px; height:34px; border-radius:4px;
          background:#3a342a; border:1px solid var(--ink);
          position:relative; cursor:pointer;
        }
        .rd-switch-knob{
          position:absolute; left:2px; width:16px; height:15px; border-radius:3px;
          background:linear-gradient(180deg,#efe6cf,#c9bfa4);
          border:1px solid var(--ink);
          transition:top .15s ease;
        }
        .rd-switch.on .rd-switch-knob{ top:2px; }
        .rd-switch.off .rd-switch-knob{ top:16px; }

        .rd-knob{
          width:40px; height:40px; border-radius:50%;
          background:radial-gradient(circle at 35% 30%, #efe6cf, #a89c7c 70%);
          border:2px solid var(--ink);
          position:relative; cursor:grab;
          transition:transform .3s ease;
        }
        .rd-knob:hover{ transform:rotate(35deg); }
        .rd-knob::after{
          content:''; position:absolute; top:4px; left:50%;
          width:2px; height:12px; background:var(--ink); transform:translateX(-50%);
        }

        @keyframes rd-blink{ 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        @keyframes rd-rotate{ from{ transform:rotate(0deg);} to{ transform:rotate(360deg);} }
        @keyframes rd-ping{ 0%,100%{ opacity:0.4; transform:scale(0.9);} 50%{ opacity:1; transform:scale(1.3);} }
        @keyframes rd-ringout{ 0%{ opacity:0.7; transform:scale(0.6);} 100%{ opacity:0; transform:scale(2.4);} }
        @keyframes rd-flicker{ 0%,96%,100%{ opacity:1;} 97%{ opacity:0.85;} }
      `}</style>

      <span className="rd-screw tl" /><span className="rd-screw tr" />
      <span className="rd-screw bl" /><span className="rd-screw br" />

      <div className="rd-toprow">
        <div className="rd-plate">OUTPOST-7 · FIELD CONSOLE</div>
        <div className="rd-leds">
          <div className="rd-led"><span className="rd-led-dot power" /><span className="rd-led-label">PWR</span></div>
          <div className="rd-led"><span className="rd-led-dot uplink" /><span className="rd-led-label">UP</span></div>
          <div className="rd-led"><span className="rd-led-dot sync" /><span className="rd-led-label">SYN</span></div>
        </div>
      </div>

      <div className="rd-screen">
        <div className="rd-grid" />
        {NODES.map((n, i) => (
          <span
            key={i}
            className="rd-node"
            style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: n.d }}
          />
        ))}
        <div className="rd-sweep" />
        <div className="rd-scanlines" />
        <div className="rd-glass" />
        <div className="rd-readout">247 NODES</div>
        <div className="rd-readout-label">SCANNING WORLD GRID…</div>
      </div>

      <div className="rd-bottomrow">
        <div className="rd-switches">
          {switches.map((on, i) => (
            <div key={i} className={`rd-switch ${on ? "on" : "off"}`} onClick={() => toggle(i)}>
              <div className="rd-switch-knob" />
            </div>
          ))}
        </div>
        <div className="rd-knob" />
      </div>
    </div>
  );
}