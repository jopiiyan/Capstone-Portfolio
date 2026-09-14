import { motion } from "framer-motion";
import { SlotStack } from "./MemberCard.jsx";
import { MEMBERS, pad } from "../data.js";
import { enterX } from "../motion/presets.js";

const metaLabel = {
  fontSize: 12, letterSpacing: "0.35px", textTransform: "uppercase",
  color: "#9a9a9a", fontWeight: 400,
};
const metaRow = {
  display: "grid", gridTemplateColumns: "84px minmax(0, 1fr)", gap: 18,
  fontSize: 15, fontWeight: 300, lineHeight: 1.55,
};

export default function ProjectPanel({ active, left, order }) {
  const p = MEMBERS[active].project;
  // Mirrors the member column, so its direction is the opposite one.
  const e = enterX(!left, 0.09);

  return (
    <div style={{ order }}>
      {/* @keyframes enRA/enRB/enLA/enLB, 90ms behind the member column */}
      <motion.div key={active} initial={e.initial} animate={e.animate} transition={e.transition}>
        <div style={{
          fontSize: 14, fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
          color: "#ffb829", marginBottom: 14,
        }}>Project · PRJ-{pad(active)} · placeholder</div>

        <h3 style={{
          fontSize: "clamp(24px, min(3.2vw, 5vh), 42px)", lineHeight: 1.2,
          letterSpacing: "-0.022em", fontWeight: 400, margin: "0 0 18px",
        }}>{p.title}</h3>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12, marginBottom: 24,
        }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "relative", aspectRatio: "4 / 3" }}>
              <SlotStack active={active} layers={MEMBERS.map((x) => ({
                key: `shot-${x.name}-${k + 1}`,
                ph: `Project photo ${k + 1}`,
                src: x.project.shots?.[k],
              }))} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <div style={metaRow}><span style={metaLabel}>Scope</span><span style={{ color: "#ffffff" }}>{p.scope}</span></div>
          <div style={metaRow}><span style={metaLabel}>Stack</span><span style={{ color: "#ffffff" }}>{p.stack}</span></div>
          <div style={metaRow}><span style={metaLabel}>Result</span><span style={{ color: "#bdbdbd" }}>{p.result}</span></div>
        </div>
      </motion.div>
    </div>
  );
}
