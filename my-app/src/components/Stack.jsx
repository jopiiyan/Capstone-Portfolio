import { STACK } from "../data.js";
import { BODY, C, DISPLAY, body, displayH } from "../theme.js";

// Laid out like the inside of a control cabinet: one DIN rail per discipline,
// each tool a labelled terminal block clipped onto it.
const RAIL_H = 14;

function Rail() {
  return (
    <span aria-hidden="true" style={{
      position: "absolute", left: 0, right: 0, top: "50%", height: RAIL_H,
      transform: "translateY(-50%)",
      borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, opacity: 0.45,
      background: `repeating-linear-gradient(90deg, transparent 0 22px, ${C.faint} 22px 34px)`,
    }} />
  );
}

function Block({ children }) {
  return (
    <span style={{
      position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
      padding: "10px 14px 10px 10px", background: C.ink,
      border: `1px solid ${C.faint}`, borderTop: `2px solid ${C.line}`,
      fontFamily: BODY, fontSize: 18, fontWeight: 500, lineHeight: 1.2, color: C.paper,
      whiteSpace: "nowrap",
    }}>
      {/* Screw terminal */}
      <span aria-hidden="true" style={{
        width: 11, height: 11, borderRadius: "50%", flex: "none",
        border: `1px solid ${C.dim}`,
        background: `linear-gradient(135deg, transparent 45%, ${C.dim} 45% 55%, transparent 55%)`,
      }} />
      {children}
    </span>
  );
}

export default function Stack() {
  return (
    <section id="stack" data-screen-label="Stack" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", alignContent: "center", gap: "clamp(28px, 5vh, 52px)",
      padding: "120px 36px 60px", maxWidth: 1280, margin: "0 auto",
    }}>
      <div className="split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 60, alignItems: "end",
      }}>
        <h2 style={{ ...displayH, fontSize: "clamp(56px, 7.6vw, 120px)" }}>Tools &amp; stack</h2>
        <p style={{ ...body, fontSize: "clamp(20px, 2.6vh, 23px)", maxWidth: "26em", margin: 0 }}>
          Sorted the way they get wired into a build: one rail per discipline.
        </p>
      </div>

      <div style={{ display: "grid", gap: "clamp(14px, 2.6vh, 26px)" }}>
        {STACK.map((s) => (
          <div key={s.group} className="rail-row" style={{
            display: "grid", gridTemplateColumns: "180px minmax(0, 1fr)",
            gap: "10px 28px", alignItems: "center",
          }}>
            <div style={{
              fontFamily: DISPLAY, fontSize: "clamp(26px, 3.4vh, 34px)", fontWeight: 800,
              lineHeight: 1, color: C.paper,
            }}>{s.group}</div>

            <div style={{ position: "relative", padding: "0 18px" }}>
              <Rail />
              <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.items.map((i) => <Block key={i}>{i}</Block>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
