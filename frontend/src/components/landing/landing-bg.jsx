import React from "react";

const boxes = [
  { x: 4, y: 12, color: "blue" },
  { x: 10, y: 28, color: "purple" },
  { x: 17, y: 8, color: "cyan" },
  { x: 24, y: 35, color: "orange" },
  { x: 31, y: 15, color: "blue" },
  { x: 38, y: 48, color: "purple" },
  { x: 45, y: 20, color: "cyan" },
  { x: 53, y: 10, color: "orange" },
  { x: 61, y: 32, color: "blue" },
  { x: 69, y: 16, color: "purple" },
  { x: 76, y: 42, color: "cyan" },
  { x: 84, y: 23, color: "orange" },
  { x: 92, y: 12, color: "blue" },

  { x: 7, y: 55, color: "cyan" },
  { x: 15, y: 72, color: "orange" },
  { x: 23, y: 61, color: "purple" },
  { x: 34, y: 78, color: "blue" },
  { x: 43, y: 67, color: "cyan" },
  { x: 52, y: 82, color: "purple" },
  { x: 63, y: 61, color: "orange" },
  { x: 72, y: 76, color: "blue" },
  { x: 81, y: 62, color: "cyan" },
  { x: 90, y: 73, color: "purple" },

  { x: 3, y: 91, color: "orange" },
  { x: 12, y: 87, color: "blue" },
  { x: 28, y: 94, color: "cyan" },
  { x: 39, y: 88, color: "orange" },
  { x: 57, y: 94, color: "blue" },
  { x: 67, y: 89, color: "purple" },
  { x: 79, y: 93, color: "orange" },
  { x: 94, y: 88, color: "cyan" },
];

const colorMap = {
  blue: {
    border: "rgba(59,130,246,.55)",
    glow: "rgba(59,130,246,.35)",
    fill: "rgba(59,130,246,.08)",
  },
  purple: {
    border: "rgba(139,92,246,.55)",
    glow: "rgba(139,92,246,.35)",
    fill: "rgba(139,92,246,.08)",
  },
  cyan: {
    border: "rgba(34,211,238,.55)",
    glow: "rgba(34,211,238,.35)",
    fill: "rgba(34,211,238,.08)",
  },
  orange: {
    border: "rgba(249,115,22,.55)",
    glow: "rgba(249,115,22,.35)",
    fill: "rgba(249,115,22,.08)",
  },
};

export default function LandingBg() {
  return (
    <>
      <style>{`
        .iot-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(76, 58, 180, 0.16),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 25%,
              rgba(0, 180, 255, 0.10),
              transparent 28%
            ),
            radial-gradient(
              circle at 50% 85%,
              rgba(120, 50, 255, 0.10),
              transparent 35%
            ),
            #050814;
        }

        .iot-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(255,255,255,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.035) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            rgba(0,0,0,.85) 55%,
            transparent 100%
          );
        }

        .iot-grid-glow {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(99,102,241,.045),
              transparent
            );
          animation: gridMove 12s linear infinite;
        }

        .iot-node {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          transform: translate(-50%, -50%);
          background: rgba(5,8,20,.72);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.015),
            0 0 22px var(--node-glow);
          animation:
            nodeFloat var(--duration) ease-in-out infinite,
            nodePulse 4s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .iot-node::before {
          content: "";
          width: 17px;
          height: 17px;
          border-radius: 4px;
          border: 1px solid currentColor;
          background: var(--node-fill);
          box-shadow:
            inset 0 0 8px var(--node-glow),
            0 0 9px var(--node-glow);
        }

        .iot-node::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 8px currentColor;
          opacity: .9;
        }

        .iot-scan {
          position: absolute;
          left: -20%;
          right: -20%;
          height: 1px;
          top: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(56,189,248,.0),
            rgba(56,189,248,.25),
            rgba(56,189,248,.0),
            transparent
          );
          filter: blur(.5px);
          animation: scan 9s ease-in-out infinite;
        }

        .iot-orb {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(99,102,241,.07),
            rgba(59,130,246,.025) 35%,
            transparent 70%
          );
          filter: blur(10px);
          animation: orbFloat 14s ease-in-out infinite;
        }

        .iot-orb-one {
          top: -180px;
          left: -140px;
        }

        .iot-orb-two {
          right: -180px;
          bottom: -180px;
          animation-delay: -6s;
        }

        .iot-vignette {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(5,8,20,.35),
              transparent 20%,
              transparent 80%,
              rgba(5,8,20,.35)
            ),
            linear-gradient(
              180deg,
              rgba(5,8,20,.45),
              transparent 25%,
              transparent 75%,
              rgba(5,8,20,.65)
            );
        }

        @keyframes nodeFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }

          50% {
            transform: translate(-50%, -50%) translateY(-7px);
          }
        }

        @keyframes nodePulse {
          0%, 100% {
            opacity: .65;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateX(-5%);
          }

          50% {
            transform: translateX(5%);
          }

          100% {
            transform: translateX(-5%);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          50% {
            opacity: .45;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(35px, -25px) scale(1.08);
          }
        }

        @media (max-width: 768px) {
          .iot-node {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }

          .iot-node::before {
            width: 12px;
            height: 12px;
            border-radius: 3px;
          }

          .iot-node::after {
            width: 4px;
            height: 4px;
          }

          .iot-grid {
            background-size: 30px 30px;
          }

          .iot-orb {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      <div className="iot-bg">
        <div className="iot-grid" />
        <div className="iot-grid-glow" />

        <div className="iot-orb iot-orb-one" />
        <div className="iot-orb iot-orb-two" />

        <div className="iot-scan" />

        {boxes.map((box, index) => {
          const c = colorMap[box.color];

          return (
            <div
              key={index}
              className="iot-node"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                color: c.border,
                borderColor: c.border,
                "--node-glow": c.glow,
                "--node-fill": c.fill,
                "--duration": `${4 + (index % 4)}s`,
                "--delay": `${-(index % 5)}s`,
              }}
            />
          );
        })}

        <div className="iot-vignette" />
      </div>
    </>
  );
}