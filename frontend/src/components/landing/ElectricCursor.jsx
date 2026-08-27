import React, { useEffect, useRef } from 'react';

export default function ElectricCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // =====================================
    // CONTROLS
    // =====================================

    const SPEED = 40;

    // How strongly the animation returns
    // towards the center
    const CENTER_PULL = 0.010;

    // Area around the center where it
    // can freely move
    const CENTER_RADIUS = 500;

    const bolts = [];

    let w;
    let h;

    // Start in the center
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    // Initial direction
    let vx = SPEED;
    let vy = SPEED * 0.7;


    // =====================================
    // RESIZE
    // =====================================

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    resize();

    window.addEventListener('resize', resize);


    // =====================================
    // CREATE ELECTRIC BOLT
    // =====================================

    function spawnBolt() {
      for (let i = 0; i < 3; i++) {

        const angle =
          Math.random() * Math.PI * 2;

        const boltSpeed =
          2 + Math.random() * 4;

        bolts.push({
          x: mx,
          y: my,

          vx: Math.cos(angle) * boltSpeed,
          vy: Math.sin(angle) * boltSpeed,

          life: 1,

          pts: [
            {
              x: mx,
              y: my,
            },
          ],
        });
      }
    }


    // =====================================
    // DRAW ELECTRIC BOLT
    // =====================================

    function drawBolt(b) {

      ctx.beginPath();

      ctx.moveTo(
        b.pts[0].x,
        b.pts[0].y
      );

      for (let i = 1; i < b.pts.length; i++) {
        ctx.lineTo(
          b.pts[i].x,
          b.pts[i].y
        );
      }

      ctx.strokeStyle =
        `rgba(0, 200, 100, ${b.life * 0.6})`;

      ctx.lineWidth = 60;

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        'rgba(18, 109, 63, 0.8)';

      ctx.stroke();

      ctx.shadowBlur = 0;
    }


    // =====================================
    // ANIMATION
    // =====================================

    let raf;

    function animate() {

      // =================================
      // FADE TRAIL
      // =================================

      ctx.fillStyle =
        'rgba(0, 0, 0, 0.08)';

      ctx.fillRect(
        0,
        0,
        w,
        h
      );


      // =================================
      // AUTOMATIC MOVEMENT
      // =================================

      mx += vx;
      my += vy;


      // =================================
      // CENTER OF SCREEN
      // =================================

      const centerX = w / 2;
      const centerY = h / 2;


      // Distance from center

      const dx = centerX - mx;
      const dy = centerY - my;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      // =================================
      // PULL TOWARDS CENTER
      // =================================

      if (distance > CENTER_RADIUS) {

        vx += dx * CENTER_PULL;
        vy += dy * CENTER_PULL;
      }


      // =================================
      // LIMIT SPEED
      // =================================

      const currentSpeed =
        Math.sqrt(
          vx * vx +
          vy * vy
        );

      if (currentSpeed > SPEED) {

        vx =
          (vx / currentSpeed) *
          SPEED;

        vy =
          (vy / currentSpeed) *
          SPEED;
      }


      // =================================
      // RANDOM DIRECTION CHANGE
      // =================================

      if (Math.random() < 0.025) {

        const angle =
          Math.random() *
          Math.PI *
          2;

        vx +=
          Math.cos(angle) * 0.8;

        vy +=
          Math.sin(angle) * 0.8;
      }


      // =================================
      // SCREEN BOUNDARIES
      // =================================

      if (mx <= 0) {

        mx = 0;

        vx = Math.abs(vx);
      }

      if (mx >= w) {

        mx = w;

        vx = -Math.abs(vx);
      }

      if (my <= 0) {

        my = 0;

        vy = Math.abs(vy);
      }

      if (my >= h) {

        my = h;

        vy = -Math.abs(vy);
      }


      // =================================
      // CREATE ELECTRIC TRAIL
      // =================================

      spawnBolt();


      // =================================
      // UPDATE BOLTS
      // =================================

      for (
        let i = bolts.length - 1;
        i >= 0;
        i--
      ) {

        const b = bolts[i];

        b.life -= 0.03;


        // Remove dead bolt

        if (b.life <= 0) {

          bolts.splice(i, 1);

          continue;
        }


        // Last point

        const last =
          b.pts[
            b.pts.length - 1
          ];


        // New point

        const nx =
          last.x +
          b.vx +
          (Math.random() - 0.5) * 10;

        const ny =
          last.y +
          b.vy +
          (Math.random() - 0.5) * 10;


        b.pts.push({
          x: nx,
          y: ny,
        });


        // Keep trail short

        if (b.pts.length > 8) {

          b.pts.shift();
        }


        // Draw

        drawBolt(b);
      }


      // =================================
      // NEXT FRAME
      // =================================

      raf =
        requestAnimationFrame(
          animate
        );
    }


    animate();


    // =====================================
    // CLEANUP
    // =====================================

    return () => {

      window.removeEventListener(
        'resize',
        resize
      );

      cancelAnimationFrame(raf);
    };

  }, []);


  // =====================================
  // CANVAS
  // =====================================

  return (
    <canvas
      className="z-[-50] opacity-90"
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}