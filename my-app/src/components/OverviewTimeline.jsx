import { motion, useReducedMotion } from "framer-motion";
import Icon from "./Icon.jsx";
import { EASE_OUT } from "../motion/presets.js";
import { TIMELINE } from "../content.js";
import { BODY, C, DISPLAY, RADIUS, body, displayH } from "../theme.js";

/** The date pill beside each phase, tinted from the accent token. */
function DatePill({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "5px 12px", borderRadius: 999,
      background: "color-mix(in srgb, var(--accent) 14%, transparent)",
      color: C.accent, fontFamily: BODY, fontSize: 13, fontWeight: 600, lineHeight: 1.2,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

// The list reveals on entry: the spine draws downward while the milestones
// arrive one after another behind it.
const SPINE = 0.9;
const STEP = 0.13;

const list = { hidden: {}, show: { transition: { staggerChildren: STEP, delayChildren: 0.15 } } };
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/**
 * Milestones alternate either side of a vertical centre line, each pegged to it
 * by a node. Below 760px the `.tl-row` / `.tl-line` hooks in index.css collapse
 * it to a single left-aligned column.
 */
export default function OverviewTimeline() {
  const reduce = useReducedMotion();
  // One shared trigger, so the spine and the milestones start together.
  const inView = { once: true, amount: 0.2 };

  return (
    <section id="timeline" data-screen-label={TIMELINE.heading} style={{
      position: "relative", zIndex: 1,
      padding: "clamp(56px, 10vh, 110px) 36px clamp(80px, 14vh, 140px)",
      maxWidth: 1080, margin: "0 auto",
    }}>
      <h2 style={{
        ...displayH, fontSize: "clamp(48px, 6.4vw, 96px)",
        marginBottom: "clamp(32px, 6vh, 64px)",
      }}>{TIMELINE.heading}</h2>

      <div style={{ position: "relative" }}>
        {/* The spine. Decorative — the running order is already in the DOM. */}
        <motion.span className="tl-line" aria-hidden="true"
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={inView}
          transition={{ duration: SPINE, ease: EASE_OUT }}
          style={{
            position: "absolute", top: 0, bottom: 0, left: "50%",
            width: 1, background: C.faint, transform: "translateX(-0.5px)",
            transformOrigin: "top",
          }} />

        <motion.ol
          variants={list}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={inView}
          style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 26 }}
        >
          {TIMELINE.milestones.map((m, i) => {
            const left = i % 2 === 0;

            return (
              <motion.li key={m.phase} className="tl-row" variants={item} style={{
                position: "relative", display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 52, alignItems: "center",
              }}>
                {/* Node on the spine. */}
                <span className="tl-node" aria-hidden="true" style={{
                  position: "absolute", left: "50%", top: "50%",
                  width: 11, height: 11, borderRadius: "50%",
                  background: C.accent, border: `2px solid ${C.canvas}`,
                  transform: "translate(-50%, -50%)",
                }} />

                <div className="tl-card" style={{
                  gridColumn: left ? 1 : 2, gridRow: 1,
                  display: "flex", gap: 14, alignItems: "flex-start",
                  padding: "clamp(16px, 2vw, 22px)",
                  background: C.ink, border: `1px solid ${C.faint}`, borderRadius: RADIUS,
                }}>
                  <Icon name={m.icon} size={26} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
                      marginBottom: 6,
                    }}>
                      <span style={{
                        fontFamily: DISPLAY, fontSize: 25, fontWeight: 700, lineHeight: 1,
                        color: C.paper,
                      }}>{m.phase}</span>
                      <DatePill>{m.date}</DatePill>
                    </div>
                    <p style={{ ...body, fontSize: 16, margin: 0 }}>{m.body}</p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
