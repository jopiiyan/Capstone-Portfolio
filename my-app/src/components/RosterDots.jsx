import { motion } from "framer-motion";
import { MEMBERS } from "../data.js";
import { EASE_CSS, HOVER_INSTANT } from "../motion/presets.js";

export default function RosterDots({ active, goTo }) {
  return (
    <div style={{ order: 3, display: "grid", gap: 4, justifyItems: "center" }}>
      {MEMBERS.map((m, n) => (
        // style-hover="opacity: 0.75"
        <motion.button key={m.name} type="button"
          onClick={() => goTo(n)} title={m.name} aria-label={m.name}
          style={{
            width: 28, height: 28, padding: 0, border: 0, background: "transparent",
            cursor: "pointer", display: "grid", placeItems: "center",
          }}
          whileHover={{ opacity: 0.75 }}
          transition={HOVER_INSTANT}
        >
          {/* transition: background 300ms ease, transform 300ms ease */}
          <motion.span
            style={{ width: 10, height: 10, borderRadius: 9999 }}
            animate={{
              backgroundColor: n === active ? "#8052ff" : "#333333",
              scale: n === active ? 1 : 0.7,
            }}
            transition={{ duration: 0.3, ease: EASE_CSS }}
          />
        </motion.button>
      ))}
    </div>
  );
}
