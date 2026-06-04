import { useState, useEffect, useRef } from "react";

// Reveals an element when it scrolls into view (returns [ref, shown]).
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

// Tracks window scroll position (used for nav blur + hero parallax).
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

// Paints the document body black on mount (prevents white flashes).
export function useBlackBody() {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#050505";
    document.documentElement.style.background = "#050505";
    return () => {
      document.body.style.background = prev;
    };
  }, []);
}
