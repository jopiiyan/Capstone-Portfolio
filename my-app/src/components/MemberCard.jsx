import { motion } from "framer-motion";
import ImageSlot from "./ImageSlot.jsx";
import { MEMBERS } from "../data.js";
import { crossFade, enterX } from "../motion/presets.js";

// transition: opacity 400ms ease — all seven portraits stay mounted and stacked
// so switching members cross-fades instead of re-decoding an image.
export function SlotStack({ active, layers }) {
  return layers.map((l, n) => (
    <motion.div key={l.key}
      style={{ position: "absolute", inset: 0, pointerEvents: n === active ? "auto" : "none" }}
      animate={{ opacity: n === active ? 1 : 0 }}
      transition={crossFade}
    >
      <ImageSlot src={l.src} placeholder={l.ph} radius={24} />
    </motion.div>
  ));
}

export default function MemberCard({ active, left, order }) {
  const m = MEMBERS[active];
  const e = enterX(left);

  const portraits = MEMBERS.map((x) => ({
    key: `portrait-${x.name}`, ph: `Photo — ${x.name}`, src: x.photo,
  }));

  return (
    <div style={{ order }}>
      {/* @keyframes enLA/enLB/enRA/enRB */}
      <motion.div key={active}
        style={{ display: "grid", gap: "clamp(14px, 2.4vh, 24px)" }}
        initial={e.initial} animate={e.animate} transition={e.transition}
      >
        <div style={{
          position: "relative", height: "clamp(150px, 32vh, 380px)",
          aspectRatio: "4 / 5", maxWidth: "100%",
        }}>
          <SlotStack active={active} layers={portraits} />
        </div>

        <div>
          <div style={{
            fontSize: 12, lineHeight: 1.5, letterSpacing: "0.35px", textTransform: "uppercase",
            color: "#8052ff", marginBottom: 12,
          }}>{String(active + 1).padStart(2, "0")} · {m.role}</div>

          <h2 style={{
            fontSize: "clamp(32px, min(5.4vw, 8.4vh), 78px)", lineHeight: 1.05,
            letterSpacing: "-0.022em", fontWeight: 400, margin: "0 0 14px",
          }}>{m.name}</h2>

          <p style={{
            fontSize: "clamp(15px, 1.9vh, 18px)", fontWeight: 300, lineHeight: 1.55,
            color: "#bdbdbd", maxWidth: 460, margin: "0 0 14px",
          }}>{m.line}</p>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: 18, fontSize: 12, letterSpacing: "0.35px",
            textTransform: "uppercase", color: "#9a9a9a",
          }}>
            {m.chips.map((chip) => <span key={chip}>{chip}</span>)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
