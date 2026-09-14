import { motion } from "framer-motion";
import BracketFrame from "./BracketFrame.jsx";
import { rise } from "../motion/presets.js";

const label = {
  fontSize: 14, fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
};

export default function Hero({ axisRef }) {
  return (
    <section data-screen-label="Capstone" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", gridTemplateRows: "1fr auto", gap: 18,
      padding: "clamp(100px, 15vh, 120px) 36px 28px", maxWidth: 1280, margin: "0 auto",
    }}>
      <BracketFrame />

      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 60, alignItems: "center",
      }}>
        {/* @keyframes rise */}
        <motion.div initial={rise.initial} animate={rise.animate} transition={rise.transition}>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            marginBottom: "clamp(16px, 3.4vh, 30px)",
          }}>
            <span style={{ ...label, color: "#ffb829" }}>Capstone · 2026</span>
            {/* @keyframes rule */}
            <motion.span
              style={{ height: 1, width: 90, background: "#ffb829", transformOrigin: "left" }}
              animate={{ scaleX: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <h1 style={{
            fontSize: "clamp(56px, 8vw, 113px)", lineHeight: 1.05, letterSpacing: "-0.022em",
            fontWeight: 400, margin: "0 0 clamp(16px, 3.2vh, 30px)",
          }}>Capstone</h1>

          <p style={{
            fontSize: 18, fontWeight: 300, lineHeight: 1.55, color: "#ffffff",
            maxWidth: 480, margin: "0 0 clamp(18px, 3.4vh, 36px)",
          }}>
            Seven engineers, one build team. We are looking for an industry partner with an
            automation problem worth solving, and we will solve it end to end.
          </p>

          {/* @keyframes ctaGlow + style-hover="background: #6f3ff5" */}
          <motion.a href="#contact"
            style={{
              ...label, display: "inline-block", background: "#8052ff", color: "#ffffff",
              padding: "15px 18px", borderRadius: 24, lineHeight: 1,
            }}
            animate={{ boxShadow: [
              "0 0 0 0 rgba(128,82,255,0.5)",
              "0 0 0 14px rgba(128,82,255,0)",
              "0 0 0 0 rgba(128,82,255,0.5)",
            ] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut" }}
            whileHover={{ backgroundColor: "#6f3ff5" }}
          >Bring us a problem</motion.a>

          {/* Written imperatively by the canvas loop, every 6th frame. */}
          <div ref={axisRef} style={{
            marginTop: "clamp(12px, 2.4vh, 26px)", fontSize: 12, lineHeight: 1.5,
            letterSpacing: "0.35px", color: "#9a9a9a", fontVariantNumeric: "tabular-nums",
            whiteSpace: "pre",
          }}>AXIS 01   0.0°   AXIS 02   0.0°   AXIS 03   0.0°</div>
        </motion.div>

        <div />
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        fontSize: 12, lineHeight: 1.5, color: "#9a9a9a",
      }}>
        <span>Scroll for the team</span>
        {/* @keyframes cue */}
        <motion.span style={{ display: "inline-block" }}
          animate={{ y: [0, 8, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >↓</motion.span>
        <span>Industrial automation · Robotics</span>
      </div>
    </section>
  );
}
