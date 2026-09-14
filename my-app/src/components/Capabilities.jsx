import { CAPABILITIES, pad } from "../data.js";

export default function Capabilities() {
  return (
    <section id="capabilities" data-screen-label="Capabilities" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", alignContent: "center", gap: "clamp(28px, 5vh, 60px)",
      padding: "clamp(88px, 13vh, 120px) 36px clamp(36px, 6vh, 60px)",
      maxWidth: 1280, margin: "0 auto",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 60, alignItems: "start",
      }}>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
            color: "#ffb829", marginBottom: 24,
          }}>What we do</div>
          <h2 style={{
            fontSize: "clamp(40px, 5.2vw, 78px)", lineHeight: 1.05,
            letterSpacing: "-0.022em", fontWeight: 400, margin: 0,
          }}>Capabilities</h2>
        </div>
        <p style={{
          fontSize: 18, fontWeight: 300, lineHeight: 1.55, color: "#bdbdbd",
          maxWidth: 520, margin: 0, alignSelf: "end",
        }}>
          One team covers the full path from a plant-floor problem to a commissioned cell.
          No handoffs between vendors, no gaps in the middle.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "clamp(24px, 4vh, 60px) 36px",
      }}>
        {CAPABILITIES.map((c, n) => (
          <div key={c.title} style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div style={{
              fontSize: 12, letterSpacing: "0.35px", textTransform: "uppercase", color: "#8052ff",
            }}>{pad(n)}</div>
            <div style={{
              fontSize: "clamp(19px, 2.6vh, 24px)", lineHeight: 1.25,
              letterSpacing: "-0.48px", fontWeight: 400,
            }}>{c.title}</div>
            <div style={{
              fontSize: "clamp(15px, 1.9vh, 18px)", fontWeight: 300,
              lineHeight: 1.55, color: "#9a9a9a",
            }}>{c.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
