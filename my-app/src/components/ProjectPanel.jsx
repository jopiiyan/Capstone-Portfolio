import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard.jsx";
import ProjectCarousel from "./ProjectCarousel.jsx";
import { MEMBERS } from "../data.js";
import { enterX } from "../motion/presets.js";
import { displayH } from "../theme.js";

export default function ProjectPanel({ active, left, order }) {
  const { projects } = MEMBERS[active];
  // Mirrors the member column, so its direction is the opposite one.
  const e = enterX(!left, 0.09);

  return (
    // Starts above the profile row so the showcase gets the extra height.
    <div style={{ order, alignSelf: "start", marginTop: "calc(-1 * clamp(0px, 6vh, 60px))" }}>
      {/* @keyframes enRA/enRB/enLA/enLB, 90ms behind the member column */}
      <motion.div key={active} initial={e.initial} animate={e.animate} transition={e.transition}>
        <h2 style={{
          ...displayH, fontSize: "clamp(40px, min(5vw, 7vh), 76px)", lineHeight: 0.85,
          textAlign: "center", margin: "0 0 clamp(20px, 4vh, 40px)",
        }}>{projects.length > 1 ? "Projects" : "Project"}</h2>

        {/* key resets to the first card when the member changes */}
        <ProjectCarousel key={active}>
          {projects.map((p) => <ProjectCard key={p.title} {...p} />)}
        </ProjectCarousel>
      </motion.div>
    </div>
  );
}
