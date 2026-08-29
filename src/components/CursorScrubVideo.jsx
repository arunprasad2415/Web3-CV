import { useEffect, useRef, useState } from "react";

/**
 * CursorScrubVideo — plays no video, "scrubs" it: the playhead tracks
 * cursor position instead of time. Adapted from a Framer code-component
 * spec into a plain React component (no Framer runtime here), same props
 * minus the property-panel wiring.
 *
 * IMPORTANT for buttery scrubbing: the source video must have every frame
 * encoded as a keyframe, or seeking snaps to the nearest keyframe instead
 * of the exact requested time. Re-encode with:
 *
 *   ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 18 -g 1 -keyint_min 1 \
 *     -x264-params "scenecut=0" -profile:v high -pix_fmt yuv420p \
 *     -movflags +faststart -an out.mp4
 *
 * Props:
 *  - src: string (video URL/path). Required to render anything.
 *  - axis: "horizontal" | "vertical" (default "horizontal")
 *  - reverse: boolean (default false)
 *  - trackingArea: "component" | "window" (default "component")
 *  - smoothing: number 0.02–1 (default 0.22) — higher = snappier
 *  - objectFit: "cover" | "contain" | "fill" (default "cover")
 *  - showPoster: boolean (default true) — keep frame 0 visible while buffering
 *  - borderRadius: number in px (default 0)
 *  - className / style: passed through to the <video> for layout/sizing
 */
export default function CursorScrubVideo({
  src,
  axis = "horizontal",
  reverse = false,
  trackingArea = "component",
  smoothing = 0.22,
  objectFit = "cover",
  showPoster = true,
  borderRadius = 0,
  className,
  style,
}) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !src) return;

    let rafId = null;
    let currentTime = 0;
    let targetTime = 0;
    let seeking = false;
    let cancelled = false;

    video.load();
    video.play()
      .then(() => video.pause())
      .catch(() => {});
    video.currentTime = 0;

    function handleCanPlayThrough() {
      if (!cancelled) setReady(true);
    }
    function handleSeeking() {
      seeking = true;
    }
    function handleSeeked() {
      seeking = false;
    }
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);

    function updateTarget(nx, ny) {
      const pos0 = axis === "horizontal" ? nx : ny;
      const pos = reverse ? 1 - pos0 : pos0;
      if (Number.isFinite(video.duration)) {
        targetTime = pos * video.duration;
      }
    }

    function handleWindowPointerMove(e) {
      const nx = clamp01(e.clientX / window.innerWidth);
      const ny = clamp01(e.clientY / window.innerHeight);
      updateTarget(nx, ny);
    }

    function handleComponentPointerMove(e) {
      const rect = root.getBoundingClientRect();
      const nx = clamp01((e.clientX - rect.left) / rect.width);
      const ny = clamp01((e.clientY - rect.top) / rect.height);
      updateTarget(nx, ny);
    }

    const moveHandler = trackingArea === "window" ? handleWindowPointerMove : handleComponentPointerMove;
    const moveTarget = trackingArea === "window" ? window : root;
    moveTarget.addEventListener("pointermove", moveHandler);

    function tick() {
      if (!cancelled) {
        const next = currentTime + (targetTime - currentTime) * smoothing;
        if (Number.isFinite(video.duration) && !seeking && Math.abs(video.currentTime - next) > 0.008) {
          video.currentTime = next;
        }
        currentTime = next;
        rafId = requestAnimationFrame(tick);
      }
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      moveTarget.removeEventListener("pointermove", moveHandler);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
      if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    };
  }, [src, axis, reverse, trackingArea, smoothing]);

  if (!src) {
    return (
      <div ref={rootRef} className={className} style={{ ...style, display: "grid", placeItems: "center", background: "rgba(255,255,255,.04)", borderRadius, color: "var(--zinc-500, #71717a)", fontSize: 12 }}>
        Add a video file
      </div>
    );
  }

  return (
    <div ref={rootRef} style={{ width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        className={className}
        style={{
          ...style,
          width: "100%",
          height: "100%",
          objectFit,
          borderRadius,
          display: "block",
          opacity: showPoster || ready ? 1 : 0,
          transition: "opacity .3s ease",
        }}
      />
    </div>
  );
}

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}
