/**
 * Stand-in for the design's <image-slot> web component. Fills its container.
 * Empty-state chrome mirrors image-slot.js's .frame / .ring / .empty rules so
 * an unfilled slot looks identical to the original.
 */
export default function ImageSlot({ src, alt, placeholder = "Drop an image", radius = 24 }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", borderRadius: radius,
        background: "rgba(127,127,127,.08)",
      }}>
        {src && (
          <img src={src} alt={alt ?? placeholder}
               style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {!src && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 6, textAlign: "center",
            padding: 12, boxSizing: "border-box", opacity: 0.75,
            font: "12px/1.35 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
            userSelect: "none",
          }}>
            <span>{placeholder}</span>
          </div>
        )}
      </div>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: radius,
        border: "1.5px dashed currentColor", opacity: 0.35,
      }} />
    </div>
  );
}
