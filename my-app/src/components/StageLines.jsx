import { motion } from "framer-motion";
import { sweep } from "../motion/presets.js";
import { C } from "../theme.js";

// @keyframes swRLA/swRLB/swLRA/swLRB. The A/B suffixes in the source only
// existed to restart the CSS animation on member change — `key` does that here.
const LINES = [
  { top: "22%", color: C.line, delay: 0 },
  { top: "50%", color: C.line, delay: 0.11 },
  { top: "78%", color: C.signal, delay: 0.22 },
];

export default function StageLines({ active, left }) {
  const dir = left ? 1 : -1; // swRL sweeps right → left

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {LINES.map((l) => {
        const s = sweep(dir, l.delay);
        return (
          <motion.div key={`${active}-${l.top}`}
            style={{ position: "absolute", left: 0, right: 0, top: l.top, height: 1, background: l.color }}
            initial={s.initial}
            animate={s.animate}
            transition={s.transition}
          />
        );
      })}
    </div>
  );
}
