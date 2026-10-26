import { motion } from "framer-motion";
import { useSignalRgb } from "../hooks/useSignalRgb.js";
import { C, DISPLAY } from "../theme.js";

// A panel push-button: a dark housing with an accent-coloured cap that sits
// proud of it and travels down when pressed. The indicator lamp lights on hover.
const DEPTH = 5;

// Renders an anchor when given an href and a real <button> when given an
// onClick, so the same cap can carry a link or an in-page action (the overview
// tab's "Explore the team" switches tabs rather than navigating).
export default function PushButton({ href, onClick, children, size = "md", glow = false }) {
  const sm = size === "sm";
  const depth = sm ? 4 : DEPTH;
  const glowRgb = useSignalRgb();
  const Tag = href ? motion.a : motion.button;
  const tagProps = href ? { href } : { type: "button", onClick };

  return (
    <Tag {...tagProps}
      initial="rest" whileHover="hover" whileTap="press"
      style={{
        position: "relative", display: "inline-block", verticalAlign: "top",
        padding: `0 0 ${depth}px`, borderRadius: 7, background: C.signalSide,
        color: C.onSignal, textDecoration: "none",
        border: "none", font: "inherit", cursor: "pointer",
      }}
      // @keyframes ctaGlow, recoloured; only the hero button carries it.
      animate={glow ? { boxShadow: [
        `0 0 0 0 rgba(${glowRgb}, 0.5)`,
        `0 0 0 14px rgba(${glowRgb}, 0)`,
        `0 0 0 0 rgba(${glowRgb}, 0.5)`,
      ] } : undefined}
      transition={glow ? { duration: 3.4, repeat: Infinity, ease: "easeOut" } : undefined}
    >
      <motion.span
        variants={{
          rest: { y: 0, backgroundColor: C.signal },
          hover: { y: 0, backgroundColor: C.signalDeep },
          press: { y: depth, backgroundColor: C.signalDeep },
        }}
        transition={{ duration: 0.08 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: sm ? 9 : 12,
          padding: sm ? "9px 14px 9px 11px" : "14px 22px 14px 16px",
          borderRadius: 7, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.25)",
          fontFamily: DISPLAY, fontWeight: 800, lineHeight: 1,
          fontSize: sm ? 18 : 24, letterSpacing: "0.01em",
        }}
      >
        {/* Indicator lamp */}
        <motion.span
          variants={{
            rest: { backgroundColor: C.signalSide, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
            hover: { backgroundColor: "#000000", boxShadow: "0 0 0 3px rgba(0,0,0,0.18)" },
            press: { backgroundColor: "#000000", boxShadow: "0 0 0 3px rgba(0,0,0,0.18)" },
          }}
          transition={{ duration: 0.12 }}
          style={{
            width: sm ? 8 : 10, height: sm ? 8 : 10, borderRadius: "50%", flex: "none",
            border: "1.5px solid rgba(0,0,0,0.55)",
          }}
        />
        {children}
      </motion.span>
    </Tag>
  );
}
