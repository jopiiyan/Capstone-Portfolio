import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Nav from "./components/Nav.jsx";
import OverviewTab from "./components/OverviewTab.jsx";
import TeamProjectsTab from "./components/TeamProjectsTab.jsx";
import { BODY, C } from "./theme.js";

/**
 * Two-tab shell. The tab is plain local state — no router and no URL change,
 * so a refresh always lands on the overview.
 *
 * Each tab owns its own scroll behaviour: TeamProjectsTab holds the snap and
 * active-member hooks (and the canvas), so switching away tears them down and
 * switching back rebuilds them against fresh DOM.
 */
export default function App({ teamName = "Capstone Team", snapScroll = true }) {
  const [tab, setTab] = useState("overview");

  // A nav link like #capabilities points at a section that only exists once the
  // team tab has rendered, so the target is parked here and consumed by the
  // layout effect below, after the new tab is in the DOM.
  const pendingAnchor = useRef(null);

  useLayoutEffect(() => {
    const anchor = pendingAnchor.current;
    pendingAnchor.current = null;

    const el = anchor ? document.querySelector(anchor) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // "instant" rather than "auto": html carries scroll-behavior: smooth, and a
    // tab switch should not animate the whole previous page past the visitor.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [tab]);

  const goToTab = useCallback((id, anchor = null) => {
    pendingAnchor.current = anchor;
    setTab(id);
  }, []);

  const goToTeam = useCallback(() => goToTab("team"), [goToTab]);

  return (
    <div style={{
      position: "relative", background: C.canvas, color: C.paper, fontFamily: BODY,
      minHeight: "100vh",
    }}>
      <Nav teamName={teamName} tab={tab} onTab={goToTab} />

      {tab === "overview"
        ? <OverviewTab onExplore={goToTeam} />
        : <TeamProjectsTab teamName={teamName} snapScroll={snapScroll} />}
    </div>
  );
}
