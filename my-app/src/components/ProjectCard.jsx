import { motion, useReducedMotion } from "framer-motion";
import ImageSlot from "./ImageSlot.jsx";
import { C, displayH } from "../theme.js";

const SHADOW_REST = "0 0 0 0 rgba(0,0,0,0), 0 0 0 1px rgba(0,0,0,0)";
const SHADOW_LIFT = `0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px ${C.line}`;

/**
 * One project on the carousel. `description` (and any other props) are read by
 * ProjectCarousel for the text beneath the frame — the card face is photo + title.
 */
export default function ProjectCard({ title, photo }) {
  const reduce = useReducedMotion();

  return (
    // Lift off the sheet: scale + tilt toward the viewer. Reduced motion keeps only the shadow.
    <motion.div
      initial={{ boxShadow: SHADOW_REST }}
      whileHover={reduce
        ? { boxShadow: SHADOW_LIFT }
        : { scale: 1.04, y: -8, rotateX: 4, rotateY: -3, boxShadow: SHADOW_LIFT }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      style={{
        height: "100%", display: "grid", gridTemplateRows: "minmax(0, 1fr) auto",
        background: C.ink, border: `1px solid ${C.faint}`, transformStyle: "preserve-3d",
      }}
    >
      <ImageSlot src={photo || undefined} alt={title} placeholder="Project photo" />
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.faint}` }}>
        <h3 style={{
          ...displayH, fontSize: "clamp(24px, min(3vw, 4.4vh), 40px)", lineHeight: 0.95,
        }}>{title}</h3>
      </div>
    </motion.div>
  );
}
