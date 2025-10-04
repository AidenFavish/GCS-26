import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeTogglePill() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  const TRACK_WIDTH = 56;
  const TRACK_HEIGHT = 32;
  const THUMB_SIZE = 28;
  const PADDING = 0; // auto-centers thumb vertically

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={!isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      style={{
        position: "relative",
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        borderRadius: 9999,
        border: "1px solid var(--border)",
        background: isLight ? "var(--panel-muted)" : "var(--primary, #1f2937)",
        cursor: "pointer",
        outline: "none",
        transition: "background 0.2s ease, border-color 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {/* Track icons */}
      <Sun
        size={14}
        style={{
          position: "absolute",
          left: 8,
          opacity: isLight ? 1 : 0.6,
          transition: "opacity 0.2s ease",
          color: "#facc15",
        }}
      />
      <Moon
        size={14}
        style={{
          position: "absolute",
          right: 8,
          opacity: isLight ? 0.6 : 1,
          transition: "opacity 0.2s ease",
          color: "#93c5fd",
        }}
      />

      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          top: PADDING,
          left: PADDING,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: "50%",
          background: "var(--panel, #fff)",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          transform: `translateX(${isLight ? 0 : TRACK_WIDTH - THUMB_SIZE - PADDING * 2}px)`,
          transition: "transform 0.25s ease",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Sun
          size={16}
          style={{
            position: "absolute",
            opacity: isLight ? 1 : 0,
            transition: "opacity 0.2s ease",
            color: "#facc15",
          }}
        />
        <Moon
          size={16}
          style={{
            position: "absolute",
            opacity: isLight ? 0 : 1,
            transition: "opacity 0.2s ease",
            color: "#3b82f6",
          }}
        />
      </div>
    </button>
  );
}
