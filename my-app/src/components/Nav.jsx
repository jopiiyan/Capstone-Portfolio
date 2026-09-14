import { motion } from "framer-motion";
import { HOVER_INSTANT } from "../motion/presets.js";

const label = {
  fontSize: 14, fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
};

const NAV_LINKS = [
  { href: "#team", text: "Team" },
  { href: "#capabilities", text: "Capabilities" },
  { href: "#stack", text: "Stack" },
];

export default function Nav({ teamName }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, display: "flex",
      alignItems: "center", gap: 24, padding: "22px 36px",
      background: "linear-gradient(#000000 55%, rgba(0,0,0,0))",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ display: "block" }}>
          <polygon points="8,1 15,14 1,14" fill="#8052ff" />
        </svg>
        <span style={label}>{teamName}</span>
      </div>

      {/* style-hover="color: #ffffff" */}
      {NAV_LINKS.map((l) => (
        <motion.a key={l.href} href={l.href}
          style={{ ...label, color: "#9a9a9a" }}
          whileHover={{ color: "#ffffff" }}
          transition={HOVER_INSTANT}
        >{l.text}</motion.a>
      ))}

      {/* style-hover="background: #6f3ff5" */}
      <motion.a href="#contact"
        style={{
          ...label, background: "#8052ff", color: "#ffffff",
          padding: "14px 18px", borderRadius: 24, lineHeight: 1,
        }}
        whileHover={{ backgroundColor: "#6f3ff5" }}
        transition={HOVER_INSTANT}
      >Contact us</motion.a>
    </div>
  );
}
