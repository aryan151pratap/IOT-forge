import React from "react";

const THEME = "white"; // "orange" | "blue" | "white" | "purple"

const themes = {
  orange: {
    base: "#0a0908",
    blob: `
      radial-gradient(
        circle,
        #f97316af 0%,
        #ea580c5b 45%,
        #9a34128c 65%,
        transparent 78%
      )
    `,
    edge: "rgba(154, 52, 18, 0.14)",
    opacity: 0.20,
    minOpacity: 0.16,
    maxOpacity: 0.24,
  },

  blue: {
    base: "#07090d",
    blob: `
      radial-gradient(
        circle,
        #3b82f6af 0%,
        #2563eb5b 45%,
        #1e40af8c 65%,
        transparent 78%
      )
    `,
    edge: "rgba(30, 64, 175, 0.14)",
    opacity: 0.20,
    minOpacity: 0.16,
    maxOpacity: 0.24,
  },

  white: {
    base: "#080808",
    blob: `
      radial-gradient(
        circle,
        #ffffff9e 0%,
        #e5e7eb69 40%,
        #9ca3af33 62%,
        transparent 78%
      )
    `,
    edge: "rgba(255, 255, 255, 0.06)",
    opacity: 0.18,
    minOpacity: 0.14,
    maxOpacity: 0.22,
  },

  purple: {
    base: "#09070d",
    blob: `
      radial-gradient(
        circle,
        #a855f7af 0%,
        #7e22ce5b 45%,
        #581c878c 65%,
        transparent 78%
      )
    `,
    edge: "rgba(88, 28, 135, 0.14)",
    opacity: 0.20,
    minOpacity: 0.16,
    maxOpacity: 0.24,
  },
};

const activeTheme = themes[THEME] || themes.purple;

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
  background: ${activeTheme.base};
}

.ab-blob {
  position: absolute;
  bottom: -20%;
  left: 50%;
  width: 46vw;
  height: 46vw;
  border-radius: 50%;
  background: ${activeTheme.blob};
  filter: blur(130px);
  mix-blend-mode: screen;
  opacity: ${activeTheme.opacity};
  transform: translateX(-50%) scale(1);
  will-change: transform, opacity;
  animation: ab-pulse 10s ease-in-out infinite alternate;
}

@keyframes ab-pulse {
  0% {
    transform: translateX(-50%) scale(1);
    opacity: ${activeTheme.minOpacity};
  }

  100% {
    transform: translateX(-50%) scale(1.12);
    opacity: ${activeTheme.maxOpacity};
  }
}

.ab-edge {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    ${activeTheme.edge} 0%,
    transparent 26%
  );
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
