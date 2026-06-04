import React, { useRef, useEffect } from "react";

// Full-page falling sakura petals. Fixed behind all content.
// Pure canvas — no images needed. Petals drift, sway, and rotate.
export default function SakuraPetals({ count = 28 }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let w, h, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = cv.width = window.innerWidth * dpr;
      h = cv.height = window.innerHeight * dpr;
    };
    resize();

    // soft pink palette
    const colors = ["#f9c5d1", "#f7a8c4", "#ffd9e6", "#f6b8cd", "#ffe3ee"];

    const rnd = (a, b) => a + Math.random() * (b - a);

    const petals = Array.from({ length: count }).map(() => spawn(true));

    function spawn(initial) {
      return {
        x: rnd(0, w),
        y: initial ? rnd(0, h) : rnd(-40 * dpr, -10 * dpr),
        size: rnd(7, 14) * dpr,
        speedY: rnd(0.4, 1.1) * dpr,
        swayAmp: rnd(20, 60) * dpr,
        swaySpeed: rnd(0.005, 0.018),
        phase: rnd(0, Math.PI * 2),
        rot: rnd(0, Math.PI * 2),
        rotSpeed: rnd(-0.02, 0.02),
        color: colors[(Math.random() * colors.length) | 0],
        opacity: rnd(0.35, 0.8),
      };
    }

    // draw a single 5-lobe petal shape
    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const s = p.size;
      // simple petal: two curves meeting at a notch
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.7, s * 0.6, s * 0.4, 0, s);
      ctx.bezierCurveTo(-s * 0.6, s * 0.4, -s * 0.6, -s * 0.7, 0, -s);
      ctx.fill();
      // little notch highlight
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.2, s * 0.15, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.phase += p.swaySpeed;
        p.y += p.speedY;
        p.x += Math.sin(p.phase) * 0.6 * dpr;
        p.rot += p.rotSpeed;
        const drawX = p.x + Math.sin(p.phase) * p.swayAmp;
        drawPetal({ ...p, x: drawX });
        if (p.y - p.size > h) Object.assign(p, spawn(false));
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className="sakura-canvas" aria-hidden="true" />;
}