import Icon from "./Icon.jsx";
import { C, DISPLAY, RADIUS, body, displayH } from "../theme.js";

/**
 * The shape both "What is Capstone?" and "Benefits from Capstone" take in the
 * deck: a heading, a lead paragraph, then three icon cards.
 */
export default function OverviewCards({ id, section }) {
  return (
    <section id={id} data-screen-label={section.heading} style={{
      position: "relative", zIndex: 1,
      padding: "clamp(56px, 10vh, 110px) 36px",
      maxWidth: 1280, margin: "0 auto",
    }}>
      <div className="split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 60, alignItems: "end", marginBottom: "clamp(28px, 5vh, 52px)",
      }}>
        <h2 style={{ ...displayH, fontSize: "clamp(48px, 6.4vw, 96px)" }}>
          {section.heading}
        </h2>
        <p style={{ ...body, fontSize: "clamp(18px, 2.4vh, 21px)", maxWidth: "30em", margin: 0 }}>
          {section.intro}
        </p>
      </div>

      <div className="card-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20,
      }}>
        {section.cards.map((c) => (
          <article key={c.title} style={{
            display: "flex", flexDirection: "column", gap: 14,
            padding: "clamp(20px, 2.6vw, 30px)",
            background: C.ink, border: `1px solid ${C.faint}`, borderRadius: RADIUS,
          }}>
            <Icon name={c.icon} size={30} />
            <h3 style={{
              fontFamily: DISPLAY, fontSize: "clamp(25px, 3vh, 31px)", fontWeight: 700,
              lineHeight: 1.05, margin: 0, color: C.paper,
            }}>{c.title}</h3>
            <p style={{ ...body, fontSize: 16, margin: 0 }}>{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
