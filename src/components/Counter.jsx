import React, { useState, useEffect } from "react";
import { useReveal } from "../hooks";

// Counts from 0 up to `to` when scrolled into view.
export default function Counter({ to, suffix = "", duration = 1800 }) {
  const [ref, shown] = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!shown) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown, to, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
