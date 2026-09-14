import { STACK } from "../data.js";

export default function Stack() {
  return (
    <section id="stack" data-screen-label="Stack" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", alignContent: "center", gap: 60, padding: "120px 36px 60px",
      maxWidth: 1280, margin: "0 auto",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 60, alignItems: "end",
      }}>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
            color: "#ffb829", marginBottom: 24,
          }}>What we work in</div>
          <h2 style={{
            fontSize: "clamp(40px, 5.2vw, 78px)", lineHeight: 1.05,
            letterSpacing: "-0.022em", fontWeight: 400, margin: 0,
          }}>Tools &amp; stack</h2>
        </div>
        <p style={{
          fontSize: 18, fontWeight: 300, lineHeight: 1.55, color: "#bdbdbd",
          maxWidth: 520, margin: 0,
        }}>Placeholder list. Trim it to what the team can defend in a room.</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36,
      }}>
        {STACK.map((s) => (
          <div key={s.group} style={{ display: "grid", gap: 18, alignContent: "start" }}>
            <div style={{
              fontSize: 12, letterSpacing: "0.35px", textTransform: "uppercase", color: "#8052ff",
            }}>{s.group}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {s.items.map((i) => (
                <div key={i} style={{
                  fontSize: 18, fontWeight: 300, lineHeight: 1.55, color: "#ffffff",
                }}>{i}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
