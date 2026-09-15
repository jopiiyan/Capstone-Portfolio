import { C, caption } from "../theme.js";

const TICK = 12;
const T = `1px solid ${C.line}`;
const TICKS = [
  { top: 0, left: 0, borderTop: T, borderLeft: T },
  { top: 0, right: 0, borderTop: T, borderRight: T },
  { bottom: 0, left: 0, borderBottom: T, borderLeft: T },
  { bottom: 0, right: 0, borderBottom: T, borderRight: T },
];

/**
 * Stand-in for the design's <image-slot> web component. Fills its container.
 * Empty slots read as a framed opening on a drawing: faint fill, green corner ticks.
 */
export default function ImageSlot({ src, alt, placeholder = "Drop an image" }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        background: "rgba(157,187,162,0.06)", outline: `1px solid ${C.faint}`,
      }}>
        {src && (
          <img src={src} alt={alt ?? placeholder}
               style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {!src && (
          <div style={{
            ...caption, position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center", textAlign: "center",
            padding: 12, fontSize: 12, userSelect: "none",
          }}>
            <span>{placeholder}</span>
          </div>
        )}
      </div>
      {TICKS.map((t, i) => (
        <span key={i} style={{ position: "absolute", width: TICK, height: TICK, pointerEvents: "none", ...t }} />
      ))}
    </div>
  );
}
