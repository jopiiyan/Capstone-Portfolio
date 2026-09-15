import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard.jsx";
import ProjectCarousel from "./ProjectCarousel.jsx";
import { MEMBERS } from "../data.js";
import { enterX } from "../motion/presets.js";
import { caption } from "../theme.js";

export default function ProjectPanel({ active, left, order }) {
  const { projects } = MEMBERS[active];
  // Mirrors the member column, so its direction is the opposite one.
  const e = enterX(!left, 0.09);

  return (
    <div style={{ order }}>
      {/* @keyframes enRA/enRB/enLA/enLB, 90ms behind the member column */}
      <motion.div key={active} initial={e.initial} animate={e.animate} transition={e.transition}>
        <div style={{ ...caption, marginBottom: 10 }}>{projects.length > 1 ? "Projects" : "Project"}</div>

        {/* key resets to the first card when the member changes */}
        <ProjectCarousel key={active}>
          {projects.map((p) => <ProjectCard key={p.title} {...p} />)}
        </ProjectCarousel>
      </motion.div>
    </div>
  );
}
