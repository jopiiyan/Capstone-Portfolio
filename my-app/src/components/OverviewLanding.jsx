import { motion } from "framer-motion";
import PushButton from "./PushButton.jsx";
import { rise } from "../motion/presets.js";
import { LANDING } from "../content.js";
import { MEMBERS } from "../data.js";
import { BODY, C, DISPLAY, RADIUS, body, caption, displayH } from "../theme.js";

// revise.md lists the roster alphabetically; data.js is in rail order.
const ROSTER = [...MEMBERS].sort((a, b) => a.name.localeCompare(b.name));

/** Renders a segmented string from content.js, keeping the deck's emphasis. */
function Segments({ parts }) {
  return parts.map((p, i) =>
    p.em
      ? <em key={i} style={{ fontStyle: "normal", color: C.accent }}>{p.t}</em>
      : <span key={i}>{p.t}</span>
  );
}

/** One highlight figure, e.g. "8 Months Applied R&D". */
function Pill({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "10px 18px", borderRadius: 999,
      background: C.ink, border: `1px solid ${C.faint}`,
      fontFamily: BODY, fontSize: 15, fontWeight: 500, lineHeight: 1.2, color: C.paper,
    }}>{children}</span>
  );
}

/**
 * A round portrait with the major badge pinned to its lower edge, name and role
 * alongside. No card around it — at this size the photographs carry the row.
 */
function MemberRow({ m }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ position: "relative", width: 124, height: 124, flex: "none" }}>
        <img src={m.photo} alt={m.name} style={{
          width: "100%", height: "100%", display: "block",
          objectFit: "cover", borderRadius: "50%", border: `1px solid ${C.faint}`,
        }} />
        {/* Ringed in the page colour so it reads as sitting on the edge. */}
        <span style={{
          position: "absolute", left: "50%", bottom: -7, transform: "translateX(-50%)",
          padding: "3px 10px", borderRadius: 999,
          background: C.accent, color: C.onSignal, border: `2px solid ${C.canvas}`,
          fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.2,
        }}>{m.major}</span>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: "clamp(28px, 3.2vw, 34px)", fontWeight: 700,
          lineHeight: 1, color: C.paper, marginBottom: 8,
        }}>{m.name}</div>
        <div style={{ ...caption, fontSize: 15, color: C.dim }}>{m.overviewRole}</div>
      </div>
    </div>
  );
}

export default function OverviewLanding({ onExplore }) {
  return (
    <section data-screen-label="Capstone overview" style={{
      position: "relative", zIndex: 1,
      padding: "clamp(110px, 16vh, 150px) 36px clamp(48px, 8vh, 80px)",
      maxWidth: 1280, margin: "0 auto",
    }}>
      {/* revise.md puts the SUTD mark top-right. The supplied file is dark ink
          on transparent, so index.css flips it for dark mode. */}
      <img className="sutd-logo" src="/pic/SUTDLogo_Dark@2x.webp"
        alt="Singapore University of Technology and Design"
        style={{
          position: "absolute", top: "clamp(94px, 13vh, 126px)", right: 36,
          width: "clamp(116px, 13vw, 158px)", height: "auto", display: "block",
        }} />

      <motion.div initial={rise.initial} animate={rise.animate} transition={rise.transition}>
        <p style={{ ...caption, fontSize: 17, color: C.line, margin: "0 0 10px" }}>
          <Segments parts={LANDING.eyebrow} />
        </p>

        <h1 style={{
          ...displayH, fontSize: "clamp(76px, min(13vw, 20vh), 220px)", lineHeight: 0.84, margin: 0,
        }}>{LANDING.title}</h1>

        {/* Dimension line, as under the hero headline on the other tab. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "clamp(18px, 3vh, 28px) 0" }}>
          <span style={{ width: 1, height: 11, background: C.line }} />
          <span style={{ height: 1, width: 120, background: C.line, opacity: 0.7 }} />
        </div>

        <p style={{
          ...body, fontSize: "clamp(20px, 2.7vh, 25px)", maxWidth: "30em", margin: 0,
        }}>
          <Segments parts={LANDING.subtitle} />
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: "clamp(24px, 4vh, 40px)" }}>
          {LANDING.pills.map((p) => <Pill key={p}>{p}</Pill>)}
        </div>
      </motion.div>

      <h2 style={{
        ...displayH, fontSize: "clamp(40px, 5.2vw, 72px)",
        margin: "clamp(56px, 9vh, 96px) 0 clamp(20px, 3vh, 32px)",
      }}>Our Team</h2>

      <div className="roster-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(430px, 1fr))",
        gap: "clamp(28px, 4vh, 44px) 40px",
      }}>
        {ROSTER.map((m) => <MemberRow key={m.name} m={m} />)}
      </div>

      <div className="split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 48, alignItems: "start", margin: "clamp(48px, 8vh, 84px) 0 0",
      }}>
        <div>
          <h3 style={{ ...displayH, fontSize: "clamp(32px, 4vw, 52px)", margin: "0 0 14px" }}>
            {LANDING.strive.heading}
          </h3>
          <p style={{ ...body, fontSize: "clamp(17px, 2.3vh, 20px)", maxWidth: "34em", margin: 0 }}>
            {LANDING.strive.body}
          </p>
        </div>

        <div style={{
          padding: 22, background: C.ink, border: `1px solid ${C.faint}`, borderRadius: RADIUS,
        }}>
          <div style={{ ...caption, marginBottom: 12, color: C.line }}>Our Majors</div>
          {LANDING.majors.map((m) => (
            <div key={m.code} style={{
              display: "flex", gap: 12, alignItems: "baseline", padding: "7px 0",
            }}>
              <span style={{
                fontFamily: BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
                color: C.accent, minWidth: 38,
              }}>{m.code}</span>
              <span style={{ ...body, fontSize: 16 }}>{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "clamp(36px, 6vh, 64px)" }}>
        <PushButton onClick={onExplore}>{LANDING.cta}</PushButton>
      </div>
    </section>
  );
}
