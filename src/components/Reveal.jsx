import React from "react";
import { useReveal } from "../hooks";

// Wraps children and animates them in (fade + slide + blur) on scroll.
export default function Reveal({ children, delay = 0, dir = "up", className = "" }) {
  const [ref, shown] = useReveal();
  const off =
    dir === "up" ? "translateY(40px)" :
    dir === "down" ? "translateY(-40px)" :
    dir === "left" ? "translateX(48px)" :
    dir === "right" ? "translateX(-48px)" : "translateY(40px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : off,
        filter: shown ? "blur(0)" : "blur(6px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 1s cubic-bezier(.16,1,.3,1) ${delay}ms, filter .9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
