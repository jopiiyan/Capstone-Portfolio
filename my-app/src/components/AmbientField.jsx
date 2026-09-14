import { motion } from "framer-motion";
import { AMBIENT_A, AMBIENT_B } from "../scene/armScene.js";
import { ALTERNATE } from "../motion/presets.js";

// @keyframes twk — opacity 0.12 → 0.95. Each polygon carries its own duration
// and a NEGATIVE delay that drops it mid-cycle, so the field is desynchronised
// from the first frame rather than pulsing in unison.
function Twinkle({ p, strokeWidth }) {
  return (
    <motion.polygon
      points={p.pts}
      fill="none"
      stroke={p.c}
      strokeWidth={strokeWidth}
      initial={{ opacity: 0.12 }}
      animate={{ opacity: [0.12, 0.95] }}
      transition={{ duration: p.dur, delay: -p.offset, ease: "easeInOut", ...ALTERNATE }}
    />
  );
}

export default function AmbientField() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.16 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* @keyframes driftB */}
        <motion.g
          animate={{ x: ["1.2%", "-1.2%"], y: ["-0.8%", "0.8%"] }}
          transition={{ duration: 34, ease: "easeInOut", ...ALTERNATE }}
        >
          {AMBIENT_A.map((p, i) => <Twinkle key={i} p={p} strokeWidth={0.14} />)}
        </motion.g>

        {/* @keyframes drift */}
        <motion.g
          style={{ transformOrigin: "50% 50%" }}
          animate={{ x: ["-1.6%", "1.6%"], y: ["1.2%", "-1.2%"], scale: [0.99, 1.02] }}
          transition={{ duration: 21, ease: "easeInOut", ...ALTERNATE }}
        >
          {AMBIENT_B.map((p, i) => <Twinkle key={i} p={p} strokeWidth={0.2} />)}
        </motion.g>
      </svg>
    </div>
  );
}
