import { CAPABILITIES } from "../data.js";
import { C, DISPLAY, body, displayH } from "../theme.js";

export default function Capabilities() {
  return (
    <section id="capabilities" data-screen-label="Capabilities" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", alignContent: "center", gap: "clamp(28px, 5vh, 56px)",
      padding: "clamp(88px, 13vh, 120px) 36px clamp(36px, 6vh, 60px)",
      maxWidth: 1280, margin: "0 auto",
    }}>
      <div className="split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 60, alignItems: "end",
      }}>
        <h2 style={{ ...displayH, fontSize: "clamp(56px, 7.6vw, 120px)" }}>
          From plant floor to working cell
        </h2>
        <p style={{ ...body, fontSize: "clamp(20px, 2.6vh, 23px)", maxWidth: "26em", margin: 0 }}>
          One team covers the whole path, so nothing falls between vendors.
        </p>
      </div>

      <div style={{ borderBottom: `1px solid ${C.faint}` }}>
        {CAPABILITIES.map((c) => (
          <div key={c.title} className="spec-row" style={{
            display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "8px 60px", alignItems: "baseline",
            padding: "clamp(12px, 2vh, 20px) 0", borderTop: `1px solid ${C.faint}`,
          }}>
            <div style={{
              fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vh, 36px)", fontWeight: 700,
              lineHeight: 1, color: C.paper,
            }}>{c.title}</div>
            <div style={{
              ...body, fontSize: "clamp(17px, 2.3vh, 20px)", color: C.paper, maxWidth: "36em",
            }}>{c.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
