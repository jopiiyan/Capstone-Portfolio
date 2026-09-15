import { MEMBERS } from "../data.js";
import PushButton from "./PushButton.jsx";
import { C, DISPLAY, body, caption, displayH } from "../theme.js";

export default function Contact({ teamName }) {
  return (
    <section id="contact" data-screen-label="Contact" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", gridTemplateRows: "1fr auto", gap: 36,
      padding: "120px 36px 36px", maxWidth: 1280, margin: "0 auto",
    }}>
      <div className="split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 60, alignItems: "center",
      }}>
        <div>
          <h2 style={{
            ...displayH, fontSize: "clamp(64px, 9vw, 150px)", lineHeight: 0.86,
            margin: "0 0 30px",
          }}>Bring us a problem</h2>
          <p style={{ ...body, fontSize: "clamp(20px, 2.6vh, 23px)", maxWidth: "26em", margin: "0 0 36px" }}>
            Tell us where the line slows down, what fails inspection, or what still runs by hand.
            We will scope it, build it, and hand it over working.
          </p>
          <PushButton href="mailto:team@example.edu">team@example.edu</PushButton>
        </div>

        <div>
          <div style={{ ...caption, marginBottom: 12 }}>The team</div>
          <div style={{ borderBottom: `1px solid ${C.faint}` }}>
            {MEMBERS.map((m) => (
              <div key={m.name} className="spec-row" style={{
                display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
                gap: "2px 24px", alignItems: "baseline", padding: "10px 0",
                borderTop: `1px solid ${C.faint}`,
              }}>
                <span style={{
                  fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: C.paper,
                }}>{m.name}</span>
                <span style={{ ...caption, fontSize: 16 }}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...caption, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <span>{teamName}</span>
        <span>Automation and robotics, Capstone 2026</span>
      </div>
    </section>
  );
}
