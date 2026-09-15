import { motion } from "framer-motion";
import ImageSlot from "./ImageSlot.jsx";
import { MEMBERS } from "../data.js";
import { crossFade, enterX } from "../motion/presets.js";
import { C, DISPLAY, body, caption, displayH } from "../theme.js";

// transition: opacity 400ms ease — all seven portraits stay mounted and stacked
// so switching members cross-fades instead of re-decoding an image.
export function SlotStack({ active, layers }) {
  return layers.map((l, n) => (
    <motion.div key={l.key}
      style={{ position: "absolute", inset: 0, pointerEvents: n === active ? "auto" : "none" }}
      animate={{ opacity: n === active ? 1 : 0 }}
      transition={crossFade}
    >
      <ImageSlot src={l.src} placeholder={l.ph} />
    </motion.div>
  ));
}

// Drawing callout balloon: the member's position on the scroll rail.
function Balloon({ n }) {
  return (
    <span style={{
      display: "inline-grid", placeItems: "center", width: 30, height: 30, flex: "none",
      border: `1px solid ${C.line}`, borderRadius: "50%", color: C.line,
      fontFamily: DISPLAY, fontSize: 17, fontWeight: 800, fontVariantNumeric: "tabular-nums",
    }}>{n}</span>
  );
}

export default function MemberCard({ active, left, order }) {
  const m = MEMBERS[active];
  const e = enterX(left);

  const portraits = MEMBERS.map((x) => ({
    key: `portrait-${x.name}`, ph: `Photo of ${x.name}`, src: x.photo,
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Balloon n={active + 1} />
            <span style={{ ...caption, fontSize: 17, color: C.line }}>{m.role}</span>
          </div>

          <h2 style={{
            ...displayH, fontSize: "clamp(44px, min(7vw, 11vh), 110px)",
            margin: "0 0 14px",
          }}>{m.name}</h2>

          <p style={{
            ...body, fontSize: "clamp(18px, 2.4vh, 22px)", color: C.paper,
            maxWidth: "26em", margin: "0 0 16px",
          }}>{m.line}</p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 14px" }}>
            {m.chips.map((chip, i) => (
              <span key={chip} style={{ ...caption, display: "inline-flex", alignItems: "center", gap: 14 }}>
                {i > 0 && <span style={{ width: 1, height: 10, background: C.line, opacity: 0.6 }} />}
                {chip}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
