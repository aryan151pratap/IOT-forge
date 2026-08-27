import React from "react";

const styles = `
.ab-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}

.ab-base {
  position: absolute;
  inset: 0;
  background: #0a0908;
}

.ab-blob {
  position: absolute;
  bottom: -20%;
  left: 50%;
  width: 46vw;
  height: 46vw;
  border-radius: 50%;
  background: radial-gradient(circle, #f97416af 0%, #c2400c5b 45%, #7c2c128c 65%, transparent 78%);
  filter: blur(130px);
  mix-blend-mode: screen;
  opacity: 0.2;
  transform: translateX(-50%) scale(1);
  will-change: transform, opacity;
  animation: ab-pulse 10s ease-in-out infinite alternate;
}

@keyframes ab-pulse {
  0% {
    transform: translateX(-50%) scale(1);
    opacity: 0.16;
  }
  100% {
    transform: translateX(-50%) scale(1.12);
    opacity: 0.24;
  }
}

.ab-edge {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(124, 44, 18, 0.12) 0%, transparent 26%);
}

@media (prefers-reduced-motion: reduce) {
  .ab-blob {
    animation: none;
  }
}
`;

export default function AgentBackground() {
  return (
    <div className="ab-root" aria-hidden="true">
      <style>{styles}</style>
      <div className="ab-base" />
      <div className="ab-edge" />
      <div className="ab-blob" />
    </div>
  );
}