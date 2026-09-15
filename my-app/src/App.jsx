import { useRef } from "react";
import AmbientField from "./components/AmbientField.jsx";
import ArmCanvas from "./components/ArmCanvas.jsx";
import Capabilities from "./components/Capabilities.jsx";
import Contact from "./components/Contact.jsx";
import Hero from "./components/Hero.jsx";
import Nav from "./components/Nav.jsx";
import Stack from "./components/Stack.jsx";
import TeamStage from "./components/TeamStage.jsx";
import { MEMBERS } from "./data.js";
import { useActiveMember } from "./hooks/useActiveMember.js";
import { useScrollSnap } from "./hooks/useScrollSnap.js";
import { BODY, C } from "./theme.js";

export default function App({ teamName = "Capstone Team", snapScroll = true }) {
  // Shared between Hero (which owns the node) and the canvas loop (which writes
  // to it 10× a second without going through React).
  const axisRef = useRef(null);

  const applySnap = useScrollSnap(snapScroll);
  const { active, railRef, goTo } = useActiveMember(MEMBERS.length, applySnap);

  return (
    <div style={{
      position: "relative", background: C.ink, color: C.paper, fontFamily: BODY,
      minHeight: "100vh",
    }}>
      <ArmCanvas axisRef={axisRef} />
      <AmbientField />
      <Nav teamName={teamName} />

      <Hero axisRef={axisRef} teamName={teamName} />
      <TeamStage active={active} railRef={railRef} goTo={goTo} />
      <Capabilities />
      <Stack />
      <Contact teamName={teamName} />
    </div>
  );
}
