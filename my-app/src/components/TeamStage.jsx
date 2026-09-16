import MemberCard from "./MemberCard.jsx";
import ProjectPanel from "./ProjectPanel.jsx";
import RosterDots from "./RosterDots.jsx";
import { MEMBERS } from "../data.js";

/**
 * A sticky full-height stage with a rail of seven full-viewport trigger divs
 * pulled up behind it (`margin-top: -100vh`). Scrolling moves through the rail
 * while the stage stays pinned; each trigger swaps the member shown.
 */
export default function TeamStage({ active, railRef, goTo }) {
  const left = active % 2 === 0;

  return (
    <section id="team" style={{ position: "relative", zIndex: 1 }}>
      <div data-screen-label="Team stage" style={{
        position: "sticky", top: 0, height: "100vh", zIndex: 1, overflow: "hidden",
        display: "grid", alignContent: "center", padding: "clamp(80px, 11vh, 110px) 36px 40px",
      }}>
        <div className="stage-grid" style={{
          position: "relative", display: "grid",
          // Widths follow the columns as they swap, so the member side is always 0.95fr.
          gridTemplateColumns: left
            ? "minmax(0, 0.95fr) minmax(0, 1.05fr) 40px"
            : "minmax(0, 1.05fr) minmax(0, 0.95fr) 40px",
          gap: "clamp(28px, 4vw, 60px)", alignItems: "center",
          maxWidth: 1280, width: "100%", margin: "0 auto",
        }}>
          <MemberCard active={active} left={left} order={left ? 1 : 2} />
          <ProjectPanel active={active} left={left} order={left ? 2 : 1} />
          <RosterDots active={active} goTo={goTo} />
        </div>
      </div>

      <div ref={railRef} style={{ marginTop: "-100vh", position: "relative", zIndex: 0 }}>
        {MEMBERS.map((m) => (
          <div key={m.name}
               style={{ height: "100vh", scrollSnapAlign: "start", pointerEvents: "none" }} />
        ))}
      </div>
    </section>
  );
}
