import React, { useState } from "react";
import RetroDevice from "./Retrodevice ";
import { DeviceGrid, CodePanel } from "./DeviceGrid";

const CITIES = [
  "KYOTO", "LAGOS", "OSLO", "AUSTIN", "PUNE", "SANTIAGO",
  "NAIROBI", "TALLINN", "PERTH", "QUITO", "SEOUL", "PORTO",
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="op-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Big+Shoulders+Stencil:wght@700&family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root{
          --bg-deep:#14110c;
          --panel-beige:#d9cfb8;
          --panel-beige-dark:#c4b896;
          --crt-amber:#ffb000;
          --crt-amber-dim:#8a5a00;
          --crt-screen:#1b1710;
          --led-red:#ff3b30;
          --led-green:#33ff66;
          --ink:#2b2620;
          --teal:#3e6e64;
          --paper:#efe6d0;
        }
        *{box-sizing:border-box;}
        .op-page{
          background:var(--bg-deep);
          color:var(--paper);
          font-family:'Space Grotesk',sans-serif;
          overflow-x:hidden;
          min-height:100vh;
        }
        .op-stencil{
          font-family:'Big Shoulders Stencil','Space Grotesk',sans-serif;
          letter-spacing:0.06em;
          text-transform:uppercase;
        }
        .op-mono{ font-family:'IBM Plex Mono',monospace; }
        .op-crtfont{ font-family:'VT323',monospace; }

        .op-container{
          max-width:1180px;
          margin:0 auto;
          padding:0 28px;
        }

        /* NAV */
        .op-nav{
          position:sticky; top:0; z-index:50;
          display:flex; align-items:center; justify-content:space-between;
          padding:18px 28px;
          background:linear-gradient(180deg, rgba(20,17,12,0.96), rgba(20,17,12,0.86));
          border-bottom:2px solid var(--panel-beige-dark);
          backdrop-filter:blur(4px);
        }
        .op-brand{ display:flex; align-items:center; gap:12px; }
        .op-brand-mark{
          width:34px; height:34px; border-radius:4px;
          background:var(--panel-beige);
          border:2px solid var(--ink);
          display:flex; align-items:center; justify-content:center;
          box-shadow: inset 0 0 0 2px var(--panel-beige-dark);
        }
        .op-brand-mark span{
          width:10px; height:10px; border-radius:50%;
          background:var(--led-green);
          box-shadow:0 0 6px var(--led-green);
          animation:op-blink 2.4s infinite ease-in-out;
        }
        .op-brand-name{ font-size:22px; color:var(--panel-beige); }
        .op-brand-sub{
          font-size:10px; color:var(--crt-amber-dim); letter-spacing:0.18em;
          margin-top:-2px;
        }
        .op-navlinks{ display:flex; gap:30px; align-items:center; }
        .op-navlinks a{
          color:var(--paper); opacity:0.75; text-decoration:none;
          font-size:14px; letter-spacing:0.03em;
        }
        .op-navlinks a:hover{ opacity:1; color:var(--crt-amber); }
        .op-switch-btn{
          display:flex; align-items:center; gap:10px;
          background:var(--panel-beige); color:var(--ink);
          border:2px solid var(--ink); border-radius:20px;
          padding:6px 16px 6px 8px; cursor:pointer;
          font-size:12px; letter-spacing:0.08em; font-weight:600;
          font-family:'IBM Plex Mono',monospace;
        }
        .op-switch-dot{
          width:16px; height:16px; border-radius:50%;
          background:var(--led-green); box-shadow:0 0 6px var(--led-green);
        }
        .op-navlinks a[href="#menu"]{ display:none; }

        /* HERO */
        .op-hero{
          display:grid; grid-template-columns:1.05fr 1fr; gap:56px;
          align-items:center; padding:80px 0 70px;
        }
        .op-eyebrow{
          display:inline-flex; align-items:center; gap:8px;
          font-family:'IBM Plex Mono',monospace; font-size:12px;
          color:var(--crt-amber); letter-spacing:0.14em;
          border:1px solid var(--crt-amber-dim); padding:5px 10px;
          border-radius:3px; margin-bottom:22px;
        }
        .op-eyebrow::before{
          content:''; width:7px; height:7px; border-radius:50%;
          background:var(--crt-amber); animation:op-blink 1.6s infinite;
        }
        .op-h1{
          font-size:58px; line-height:1.02; color:var(--panel-beige);
          margin:0 0 22px; font-weight:700;
        }
        .op-h1 em{ font-style:normal; color:var(--crt-amber); }
        .op-lede{
          font-size:17px; line-height:1.6; color:#c9c0ab; max-width:480px;
          margin-bottom:34px;
        }
        .op-cta-row{ display:flex; gap:16px; }
        .op-btn{
          font-family:'IBM Plex Mono',monospace; font-size:13px;
          letter-spacing:0.05em; padding:14px 22px; cursor:pointer;
          border-radius:6px; font-weight:600;
        }
        .op-btn-primary{
          background:var(--crt-amber); color:#1b1710; border:2px solid #1b1710;
          box-shadow:3px 3px 0 var(--ink);
          transition:transform .12s ease;
        }
        .op-btn-primary:hover{ transform:translate(1px,1px); box-shadow:2px 2px 0 var(--ink); }
        .op-btn-ghost{
          background:transparent; color:var(--panel-beige);
          border:2px solid var(--panel-beige-dark);
        }
        .op-btn-ghost:hover{ border-color:var(--crt-amber); color:var(--crt-amber); }

        /* MARQUEE */
        .op-marquee-wrap{
          border-top:2px solid var(--panel-beige-dark);
          border-bottom:2px solid var(--panel-beige-dark);
          background:#0f0c08;
          padding:14px 0; overflow:hidden;
        }
        .op-marquee-track{
          display:flex; gap:40px; width:max-content;
          animation:op-scroll 26s linear infinite;
        }
        .op-marquee-item{
          font-family:'VT323',monospace; font-size:22px; color:var(--led-green);
          display:flex; align-items:center; gap:10px; white-space:nowrap;
          text-shadow:0 0 6px rgba(51,255,102,0.5);
        }
        .op-marquee-item::before{
          content:'●'; font-size:10px; color:var(--led-green);
        }

        /* FEATURES */
        .op-section{ padding:88px 0; }
        .op-section-head{ max-width:560px; margin-bottom:48px; }
        .op-kicker{
          font-family:'IBM Plex Mono',monospace; font-size:12px;
          color:var(--teal); letter-spacing:0.16em; margin-bottom:10px;
        }
        .op-h2{ font-size:34px; color:var(--panel-beige); margin:0 0 12px; }
        .op-sub{ color:#b7ae99; font-size:15px; line-height:1.6; }

        .op-features{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .op-feature-card{
          background:var(--panel-beige); border:2px solid var(--ink);
          border-radius:8px; padding:22px; color:var(--ink);
          box-shadow:5px 5px 0 rgba(0,0,0,0.35);
        }
        .op-feature-icon{
          width:42px; height:30px; border:2px solid var(--ink); border-radius:3px;
          display:flex; align-items:flex-end; gap:3px; padding:4px; margin-bottom:16px;
          background:#c9bfa4;
        }
        .op-feature-icon i{
          flex:1; background:var(--teal); border-radius:1px;
          animation:op-vu 1.8s ease-in-out infinite;
        }
        .op-feature-icon i:nth-child(1){ height:35%; animation-delay:0s; }
        .op-feature-icon i:nth-child(2){ height:70%; animation-delay:.2s; }
        .op-feature-icon i:nth-child(3){ height:50%; animation-delay:.4s; }
        .op-feature-icon i:nth-child(4){ height:90%; animation-delay:.6s; }
        .op-feature-title{ font-size:17px; font-weight:700; margin-bottom:8px; }
        .op-feature-body{ font-size:13.5px; line-height:1.55; opacity:0.8; }

        /* STATS */
        .op-stats{
          display:grid; grid-template-columns:repeat(3,1fr); gap:20px;
          background:var(--crt-screen); border:3px solid var(--panel-beige-dark);
          border-radius:10px; padding:34px 10px;
        }
        .op-stat{ text-align:center; border-right:1px solid #362c1e; }
        .op-stat:last-child{ border-right:none; }
        .op-stat-num{
          font-family:'VT323',monospace; font-size:52px; color:var(--crt-amber);
          text-shadow:0 0 10px rgba(255,176,0,0.55); line-height:1;
        }
        .op-stat-label{
          font-family:'IBM Plex Mono',monospace; font-size:11px; color:#a08d63;
          letter-spacing:0.14em; margin-top:6px;
        }

        /* FOOTER */
        .op-footer{
          border-top:2px solid var(--panel-beige-dark); padding:38px 0 30px;
          display:flex; justify-content:space-between; align-items:center;
          flex-wrap:wrap; gap:16px;
        }
        .op-footer-serial{
          font-family:'IBM Plex Mono',monospace; font-size:11px; color:#7d735c;
          letter-spacing:0.08em;
        }

        @keyframes op-blink{
          0%,100%{ opacity:1; } 50%{ opacity:0.25; }
        }
        @keyframes op-scroll{
          from{ transform:translateX(0); } to{ transform:translateX(-50%); }
        }
        @keyframes op-vu{
          0%,100%{ transform:scaleY(0.6); } 50%{ transform:scaleY(1); }
        }

        @media (max-width: 860px){
          .op-hero{ grid-template-columns:1fr; padding:50px 0; }
          .op-h1{ font-size:38px; }
          .op-features{ grid-template-columns:1fr; }
          .op-stats{ grid-template-columns:1fr; }
          .op-stat{ border-right:none; border-bottom:1px solid #362c1e; padding-bottom:14px; }
          .op-navlinks a:not([href="#menu"]){ display:none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="px-4 p-4 flex flex-row justify-between">
        <div className="op-brand">
          <div className="p-4 bg-yellow-200/80 rounded"><span /></div>
          <div>
            <div className="op-brand-name op-stencil">Outpost</div>
            <div className="op-brand-sub op-mono">GLOBAL NODE NETWORK</div>
          </div>
        </div>
        <div className="op-navlinks">
          <a href="#platform">Platform</a>
          <a href="#devices">Devices</a>
          <a href="#firmware">Firmware</a>
          <a href="#docs">Docs</a>
          <button className="op-switch-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="op-switch-dot" />
            LAUNCH CONSOLE
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="w-full mt-10 flex justify-between p-4 px-50">
        <div className="w-full">
          <div className="op-eyebrow">STATION STATUS: ALL SECTORS ONLINE</div>
          <h1 className="op-h1">
            One console.<br />Every device,<br /><em>anywhere on Earth.</em>
          </h1>
          <p className="op-lede">
            Outpost is the field radio for your IoT fleet — flash a few lines of
            MicroPython to a node, and it reports in from Lagos, Kyoto or your
            garage, all on the same amber-lit console.
          </p>
          <div className="op-cta-row">
            <button className="op-btn op-btn-primary">CONNECT A NODE →</button>
            <button className="op-btn op-btn-ghost">VIEW DOCS</button>
          </div>
        </div>
        <div className="w-full">
			<RetroDevice />
		</div>
      </header>

      {/* MARQUEE */}
      <div className="op-marquee-wrap">
        <div className="op-marquee-track">
          {[...CITIES, ...CITIES].map((c, i) => (
            <div className="op-marquee-item" key={i}>{c} · ONLINE</div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="op-container op-section" id="platform">
        <div className="op-section-head">
          <div className="op-kicker">// WHY OUTPOST</div>
          <h2 className="op-h2">Built like the hardware it talks to</h2>
          <p className="op-sub">
            No dashboards pretending to be spaceships. Just legible readouts,
            physical-feeling controls, and a protocol that survives bad signal.
          </p>
        </div>
        <div className="op-features">
          <FeatureCard
            title="Global Mesh Relay"
            body="Nodes hop through the nearest relay station in 132 countries, so a sensor in Quito reports as fast as one down the hall."
          />
          <FeatureCard
            title="MicroPython-Ready"
            body="A single import and a token connect any ESP32 or Pico W to the network — no proprietary SDK, no vendor lock."
          />
          <FeatureCard
            title="Offline-First Buffering"
            body="Nodes log locally through outages and resync automatically, so you never lose a reading to a dropped uplink."
          />
        </div>
      </section>

      {/* STATS */}
      <section className="op-container">
        <div className="op-stats">
          <Stat num="48,206" label="NODES CONNECTED" />
          <Stat num="132" label="COUNTRIES REPORTING" />
          <Stat num="99.98%" label="UPLINK UPTIME" />
        </div>
      </section>

      {/* DEVICE GRID */}
      <section className="op-container op-section" id="devices">
        <div className="op-section-head">
          <div className="op-kicker">// LIVE FLEET</div>
          <h2 className="op-h2">A rack of your devices, always in view</h2>
          <p className="op-sub">
            Every node gets its own readout — signal, battery, last check-in —
            styled like the panel gear it's sitting next to.
          </p>
        </div>
        <DeviceGrid />
      </section>

      {/* CODE */}
      <section className="op-container op-section" id="firmware">
        <div className="op-section-head">
          <div className="op-kicker">// FIRMWARE</div>
          <h2 className="op-h2">Flash it in five lines</h2>
          <p className="op-sub">
            Wire your MicroPython board to Outpost with a single Uplink object —
            it queues readings locally and pushes them the moment it has signal.
          </p>
        </div>
        <CodePanel />
      </section>

      {/* FOOTER */}
      <footer className="op-container op-footer">
        <div className="op-brand">
          <div className="op-brand-mark"><span /></div>
          <div className="op-brand-name op-stencil" style={{ fontSize: 18 }}>Outpost</div>
        </div>
        <div className="op-footer-serial">UNIT REV. OP-7 · SERIAL 048-206-KY · MANUFACTURED FOR GLOBAL FIELD USE</div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, body }) {
  return (
    <div className="op-feature-card">
      <div className="op-feature-icon"><i /><i /><i /><i /></div>
      <div className="op-feature-title">{title}</div>
      <div className="op-feature-body">{body}</div>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div className="op-stat">
      <div className="op-stat-num op-crtfont">{num}</div>
      <div className="op-stat-label op-mono">{label}</div>
    </div>
  );
}