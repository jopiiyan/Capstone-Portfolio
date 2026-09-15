import { motion } from "framer-motion";
import { EASE_OUT } from "../motion/presets.js";
import { C, caption } from "../theme.js";

// Each corner ran TWO CSS animations on one element: `brk` (700ms entry, fill
// `both`) then `brkPulse` (4.5s infinite), both writing `opacity`. brk always
// reaches opacity 1 before its pulse's delay elapses, so nesting the two —
// outer runs the entry, inner loops the pulse — multiplies to exactly the same
// values CSS produced by override. Borders live on the inner element so the
// pulse actually fades them; transform-origin stays on the outer, scaled one.
const B = `1px solid ${C.line}`;
const CORNERS = [
  { pos: { top: 0, left: 0 },     origin: "top left",     border: { borderLeft: B, borderTop: B },     brk: 0,    pulse: 0.7 },
  { pos: { top: 0, right: 0 },    origin: "top right",    border: { borderRight: B, borderTop: B },    brk: 0.12, pulse: 1.0 },
  { pos: { bottom: 0, left: 0 },  origin: "bottom left",  border: { borderLeft: B, borderBottom: B },  brk: 0.24, pulse: 1.4 },
  { pos: { bottom: 0, right: 0 }, origin: "bottom right", border: { borderRight: B, borderBottom: B }, brk: 0.36, pulse: 1.8 },
];

export default function BracketFrame({ teamName }) {
  return (
    <div style={{ position: "absolute", inset: "104px 30px 30px", pointerEvents: "none" }}>
      {CORNERS.map((c, i) => (
        <motion.span key={i}
          style={{ position: "absolute", ...c.pos, width: 26, height: 26, transformOrigin: c.origin }}
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: c.brk, ease: EASE_OUT }}
        >
          <motion.span
            style={{ display: "block", width: "100%", height: "100%", ...c.border }}
            animate={{ opacity: [0.75, 0.3, 0.75] }}
            transition={{ duration: 4.5, delay: c.pulse, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      ))}

      {/* Title block, tucked inside the top-right bracket like a drawing sheet. */}
      <div className="title-block" style={{
        position: "absolute", top: 14, right: 40, display: "grid",
        gridTemplateColumns: "auto auto", border: `1px solid ${C.faint}`,
        ...caption, fontSize: 13,
      }}>
        <span style={{ padding: "6px 10px", borderRight: `1px solid ${C.faint}`, color: C.paper }}>{teamName}</span>
        <span style={{ padding: "6px 10px" }}>Sheet 1 of 5</span>
      </div>
    </div>
  );
}
