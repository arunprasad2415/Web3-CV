import React from "react";

// Full-screen loader with dual spinning rings + progress bar.
export default function Loader({ loading }) {
  return (
    <div
      className="loader"
      style={{
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? "auto" : "none",
        transition: "opacity .8s ease .2s",
      }}
    >
      <div className="loader-rings">
        <div className="loader-ring-base" />
        <div className="loader-ring-1" />
        <div className="loader-ring-2" />
      </div>
      <p className="loader-text">Entering Web3</p>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
    </div>
  );
}
