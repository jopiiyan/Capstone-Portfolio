import { motion } from "framer-motion";
import { EASE_OUT } from "../motion/presets.js";
import { C, caption } from "../theme.js";

// Each corner scales into place once and then holds. (The design also looped a
// 4.5s `brkPulse` on top; it was dropped to quiet the page down.) Borders live
// on the inner element, transform-origin on the outer, scaled one.
const B = `1px solid ${C.line}`;
const CORNERS = [
  { pos: { top: 0, left: 0 },     origin: "top left",     border: { borderLeft: B, borderTop: B },     brk: 0 },
  { pos: { top: 0, right: 0 },    origin: "top right",    border: { borderRight: B, borderTop: B },    brk: 0.12 },
  { pos: { bottom: 0, left: 0 },  origin: "bottom left",  border: { borderLeft: B, borderBottom: B },  brk: 0.24 },
  { pos: { bottom: 0, right: 0 }, origin: "bottom right", border: { borderRight: B, borderBottom: B }, brk: 0.36 },
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
          <span style={{ display: "block", width: "100%", height: "100%", opacity: 0.75, ...c.border }} />
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
