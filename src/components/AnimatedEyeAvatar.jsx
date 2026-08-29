import { useEffect, useRef } from "react";

/**
 * AnimatedEyeAvatar — renders the character portrait on a <canvas> with
 * only the iris/pupil regions subtly shifting toward the cursor. The base
 * artwork (head, hair, face, eyelids, highlights, background) is painted
 * once and never redrawn except two small per-eye patches — and those
 * patches are cropped from the SAME source image, so any pixel exposed at
 * the patch's edge is identical to what it's covering. One canvas, one
 * rendered image, no DOM overlays.
 *
 * Eye geometry below is calibrated to this specific portrait — measured by
 * sampling the actual source pixels (not eyeballed from a screenshot). If
 * the artwork changes, these coordinates need remeasuring.
 */

const NATIVE_W = 576;
const NATIVE_H = 768;

const EYES = [
  { cx: 242, cy: 373, resetR: 32, clipR: 20, patch: 88 }, // screen-left eye
  { cx: 418, cy: 338, resetR: 32, clipR: 20, patch: 88 }, // screen-right eye
];

const MAX_DX = 10; // native-image px
const MAX_DY = 7;
const SMOOTHING = 0.12; // lower = more inertia/lag
const MOVE_EPSILON = 0.04; // skip a redraw below this much change
const PULL_DISTANCE = 260; // px of on-screen cursor distance to reach full deflection

export default function AnimatedEyeAvatar({ src, className, style }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !src) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    let cancelled = false;
    let rafId = null;
    let ro = null;
    let removeMoveListener = () => {};

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      // Crop each eye's neutral patch once, at native resolution. This is
      // used both to reset the socket to neutral each frame and as the
      // source texture for the shifted iris — same asset, so no seams.
      const patches = EYES.map((eye) => {
        const p = document.createElement("canvas");
        p.width = eye.patch;
        p.height = eye.patch;
        p.getContext("2d").drawImage(
          img,
          eye.cx - eye.patch / 2, eye.cy - eye.patch / 2, eye.patch, eye.patch,
          0, 0, eye.patch, eye.patch
        );
        return p;
      });

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let cssW = 0, cssH = 0, scale = 1, offX = 0, offY = 0;

      // Reproduces CSS object-fit: cover for the native image inside the
      // container, in the image's own coordinate system (responsive).
      function computeCover() {
        const rect = container.getBoundingClientRect();
        cssW = rect.width;
        cssH = rect.height;
        canvas.width = Math.max(1, Math.round(cssW * dpr));
        canvas.height = Math.max(1, Math.round(cssH * dpr));
        canvas.style.width = cssW + "px";
        canvas.style.height = cssH + "px";
        scale = Math.max(cssW / NATIVE_W, cssH / NATIVE_H);
        offX = (cssW - NATIVE_W * scale) / 2;
        offY = (cssH - NATIVE_H * scale) / 2;
      }

      function toDisplay(nx, ny) {
        return [nx * scale + offX, ny * scale + offY];
      }

      function drawBase() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cssW, cssH);
        ctx.drawImage(img, 0, 0, NATIVE_W, NATIVE_H, offX, offY, NATIVE_W * scale, NATIVE_H * scale);
      }

      function drawEye(eye, patch, dx, dy) {
        const [cxD, cyD] = toDisplay(eye.cx, eye.cy);
        const patchSizeD = eye.patch * scale;

        // 1) repaint the neutral patch — erases whatever was drawn last frame.
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cxD, cyD, eye.resetR * scale, eye.resetR * scale, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(patch, cxD - patchSizeD / 2, cyD - patchSizeD / 2, patchSizeD, patchSizeD);
        ctx.restore();

        // 2) draw the same patch shifted by (dx,dy), clipped to a circle
        // safely inside the iris fill so it never touches the eyelid/skin.
        const [pcxD, pcyD] = toDisplay(eye.cx + dx, eye.cy + dy);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cxD, cyD, eye.clipR * scale, eye.clipR * scale, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(patch, pcxD - patchSizeD / 2, pcyD - patchSizeD / 2, patchSizeD, patchSizeD);
        ctx.restore();
      }

      // Declared before any early return so the resize observer (attached
      // regardless of reduced-motion/touch) always has something valid to
      // redraw at — zero offset is exactly the correct static position.
      const cur = EYES.map(() => ({ dx: 0, dy: 0 }));
      const last = EYES.map(() => ({ dx: 0, dy: 0 }));

      computeCover();
      drawBase();
      ro = new ResizeObserver(() => {
        computeCover();
        drawBase();
        EYES.forEach((eye, i) => drawEye(eye, patches[i], cur[i].dx, cur[i].dy));
      });
      ro.observe(container);

      if (reduceMotion || touchOnly) {
        return; // static portrait, no tracking, no animation loop
      }

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 3;
      function onMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
      window.addEventListener("pointermove", onMove, { passive: true });
      removeMoveListener = () => window.removeEventListener("pointermove", onMove);

      function tick() {
        if (cancelled) return;
        const rect = container.getBoundingClientRect();
        let changed = false;

        EYES.forEach((eye, i) => {
          const [exD, eyD] = toDisplay(eye.cx, eye.cy);
          const eyeScreenX = rect.left + exD;
          const eyeScreenY = rect.top + eyD;
          let vx = mouseX - eyeScreenX;
          let vy = mouseY - eyeScreenY;
          const dist = Math.hypot(vx, vy) || 1;
          vx /= dist;
          vy /= dist;
          const pull = Math.min(dist / PULL_DISTANCE, 1);
          const targetDX = vx * MAX_DX * pull;
          const targetDY = vy * MAX_DY * pull;

          const c = cur[i];
          c.dx += (targetDX - c.dx) * SMOOTHING;
          c.dy += (targetDY - c.dy) * SMOOTHING;

          if (Math.abs(c.dx - last[i].dx) > MOVE_EPSILON || Math.abs(c.dy - last[i].dy) > MOVE_EPSILON) {
            changed = true;
          }
        });

        if (changed) {
          EYES.forEach((eye, i) => {
            drawEye(eye, patches[i], cur[i].dx, cur[i].dy);
            last[i].dx = cur[i].dx;
            last[i].dy = cur[i].dy;
          });
        }

        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    };

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      removeMoveListener();
    };
  }, [src]);

  return (
    <div ref={containerRef} className={className} style={{ ...style, position: "relative" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
