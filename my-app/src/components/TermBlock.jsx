import { BODY, C } from "../theme.js";

// A labelled terminal block, as clipped onto a DIN rail. `compact` is the badge
// size used beside member portraits; long labels wrap there instead of overflowing.
export default function TermBlock({ children, compact = false }) {
  const screw = compact ? 9 : 11;

  return (
    <span style={{
      position: "relative", display: "inline-flex", alignItems: "center",
      gap: compact ? 8 : 10,
      padding: compact ? "6px 10px 6px 8px" : "10px 14px 10px 10px",
      background: C.ink, border: `1px solid ${C.faint}`, borderTop: `2px solid ${C.line}`,
      fontFamily: BODY, fontSize: compact ? 14 : 18, fontWeight: 500, lineHeight: 1.2,
      color: C.paper, whiteSpace: compact ? "normal" : "nowrap", maxWidth: "100%",
    }}>
      {/* Screw terminal */}
      <span aria-hidden="true" style={{
        width: screw, height: screw, borderRadius: "50%", flex: "none",
        border: `1px solid ${C.dim}`,
        background: `linear-gradient(135deg, transparent 45%, ${C.dim} 45% 55%, transparent 55%)`,
      }} />
      {children}
    </span>
  );
}
