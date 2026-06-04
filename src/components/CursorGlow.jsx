import React, { useEffect, useRef } from "react";

// Soft light that trails the mouse. Disabled on touch / reduced-motion.
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    // Only bail out for explicit reduced-motion preference.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y, raf;
    let moved = false;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!moved) { moved = true; el.style.opacity = "1"; }
    };

    const tick = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("pointermove", onMove);
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}