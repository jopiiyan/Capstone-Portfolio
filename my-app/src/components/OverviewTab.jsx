import ArmCanvas from "./ArmCanvas.jsx";
import OverviewCards from "./OverviewCards.jsx";
import OverviewLanding from "./OverviewLanding.jsx";
import OverviewTimeline from "./OverviewTimeline.jsx";
import { BENEFITS, WHAT_IS } from "../content.js";

/**
 * Tab 1 — the pitch. One continuous scroll: the roster, then the three deck
 * sections.
 *
 * The canvas runs in ambient mode: the same drifting field the showcase tab
 * settles into, without the arm, whose assembly and burst are keyed to a page
 * that opens on the hero (see TeamProjectsTab).
 */
export default function OverviewTab({ onExplore }) {
  return (
    <>
      <ArmCanvas ambientOnly />

      <OverviewLanding onExplore={onExplore} />
      <OverviewCards id="what-is-capstone" section={WHAT_IS} />
      <OverviewCards id="benefits" section={BENEFITS} />
      <OverviewTimeline />
    </>
  );
}
