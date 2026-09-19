import { useCallback, useRef } from "react";
import ArmCanvas from "./ArmCanvas.jsx";
import Capabilities from "./Capabilities.jsx";
import Contact from "./Contact.jsx";
import Hero from "./Hero.jsx";
import MeetTheTeam from "./MeetTheTeam.jsx";
import Stack from "./Stack.jsx";
import TeamStage from "./TeamStage.jsx";
import { MEMBERS } from "../data.js";
import { useActiveMember } from "../hooks/useActiveMember.js";
import { useScrollSnap } from "../hooks/useScrollSnap.js";

/**
 * Tab 2 — the original single-page site, unchanged in order or logic.
 *
 * The two scroll hooks live here rather than in App so their lifetime matches
 * the tab's. useActiveMember's IntersectionObserver effect depends on [count]
 * alone, so if it outlived a tab switch it would go on observing the detached
 * rail from the previous mount and `active` would stick at 0. Owning them here
 * means a remount re-runs them against the fresh rail.
 *
 * ArmCanvas is mounted here for the same reason: its scroll choreography is
 * keyed to absolute scrollY (MEET_START = 1 in scene/armScene.js), which only
 * lines up with a page that opens on Hero + MeetTheTeam.
 */
export default function TeamProjectsTab({ teamName, snapScroll }) {
  // Shared between Hero (which owns the node) and the canvas loop (which writes
  // to it 10× a second without going through React).
  const axisRef = useRef(null);

  const applySnap = useScrollSnap(snapScroll);
  const { active, railRef, goTo } = useActiveMember(MEMBERS.length, applySnap);

  // The Meet-the-Team arrow drops the visitor on the first member, where the
  // project showcase lives. goTo handles suspending scroll-snap for the ride.
  const goToShowcase = useCallback(() => goTo(0), [goTo]);

  return (
    <>
      <ArmCanvas axisRef={axisRef} />

      <Hero axisRef={axisRef} teamName={teamName} />
      <MeetTheTeam onAdvance={goToShowcase} />
      <TeamStage active={active} railRef={railRef} goTo={goTo} />
      <Capabilities />
      <Stack />
      <Contact teamName={teamName} />
    </>
  );
}
