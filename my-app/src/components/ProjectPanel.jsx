import { motion } from "framer-motion";
import { SlotStack } from "./MemberCard.jsx";
import { MEMBERS } from "../data.js";
import { enterX } from "../motion/presets.js";
import { BODY, C, caption, displayH } from "../theme.js";

// Scope / Stack / Result set like the title block of a drawing sheet.
const cell = { padding: "10px 14px", borderTop: `1px solid ${C.faint}` };

export default function ProjectPanel({ active, left, order }) {
  const p = MEMBERS[active].project;
  // Mirrors the member column, so its direction is the opposite one.
  const e = enterX(!left, 0.09);

  const rows = [
    ["Scope", p.scope, C.paper],
    ["Stack", p.stack, C.paper],
    ["Result", p.result, C.dim],
  ];

  return (
    <div style={{ order }}>
      {/* @keyframes enRA/enRB/enLA/enLB, 90ms behind the member column */}
      <motion.div key={active} initial={e.initial} animate={e.animate} transition={e.transition}>
        <div style={{ ...caption, marginBottom: 10 }}>Project</div>

        <h3 style={{
          ...displayH, fontSize: "clamp(32px, min(4.2vw, 6.4vh), 58px)", lineHeight: 0.95,
          margin: "0 0 20px",
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

        <div style={{
          display: "grid", gridTemplateColumns: "84px minmax(0, 1fr)", maxWidth: 540,
          borderBottom: `1px solid ${C.faint}`, borderLeft: `1px solid ${C.faint}`,
          borderRight: `1px solid ${C.faint}`,
        }}>
          {rows.map(([label, value, color]) => [
            <span key={`${label}-l`} style={{ ...cell, ...caption, borderRight: `1px solid ${C.faint}` }}>{label}</span>,
            <span key={`${label}-v`} style={{
              ...cell, fontFamily: BODY, fontSize: 17, fontWeight: 400, lineHeight: 1.45, color,
            }}>{value}</span>,
          ])}
        </div>
      </motion.div>
    </div>
  );
}
