import { motion } from "framer-motion";
import BracketFrame from "./BracketFrame.jsx";
import { rise } from "../motion/presets.js";
import PushButton from "./PushButton.jsx";
import { C, body, caption, displayH } from "../theme.js";

export default function Hero({ axisRef, teamName }) {
  return (
    <section data-screen-label="Capstone" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", gridTemplateRows: "1fr auto", gap: 18,
      padding: "clamp(100px, 15vh, 120px) 36px 28px", maxWidth: 1280, margin: "0 auto",
    }}>
      <BracketFrame teamName={teamName} />

      <div className="split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 60, alignItems: "center",
      }}>
        {/* @keyframes rise */}
        <motion.div initial={rise.initial} animate={rise.animate} transition={rise.transition}>
          <h1 style={{
            ...displayH, fontSize: "clamp(60px, min(8vw, 13vh), 128px)", lineHeight: 0.86,
            margin: 0, maxWidth: "8em",
          }}>We build the cell that fixes your line.</h1>

          {/* Dimension line under the headline. @keyframes rule */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            margin: "clamp(18px, 3.4vh, 30px) 0",
          }}>
            <span style={{ width: 1, height: 11, background: C.line }} />
            <motion.span
              style={{ height: 1, width: 120, background: C.line, transformOrigin: "left" }}
              animate={{ scaleX: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span style={{ ...caption, color: C.line }}>Capstone 2026</span>
          </div>

          <p style={{
            ...body, fontSize: "clamp(20px, 2.7vh, 24px)",
            maxWidth: "26em", margin: "0 0 clamp(20px, 3.6vh, 38px)",
          }}>
            Seven engineers, one build team. We are looking for an industry partner with an
            automation problem worth solving, and we will solve it end to end.
          </p>

          {/* @keyframes ctaGlow lives inside PushButton */}
          <PushButton href="#contact" glow>Bring us a problem</PushButton>

          {/* Written imperatively by the canvas loop, every 6th frame. */}
          <div ref={axisRef} style={{
            ...caption, marginTop: "clamp(14px, 2.6vh, 28px)",
            fontVariantNumeric: "tabular-nums", whiteSpace: "pre",
          }}>J1   +0.0°    J2   +0.0°    J3   +0.0°</div>
        </motion.div>

        <div />
      </div>

      <div style={{
        ...caption, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <span>Scroll to meet the team</span>
        {/* @keyframes cue */}
        <motion.span style={{ display: "inline-block", color: C.line }}
          animate={{ y: [0, 8, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >↓</motion.span>
        <span>Industrial automation and robotics</span>
      </div>
    </section>
  );
}
