import { motion } from "framer-motion";
import { HOVER_INSTANT } from "../motion/presets.js";
import PushButton from "./PushButton.jsx";
import { BODY, C } from "../theme.js";

const link = { fontFamily: BODY, fontSize: 16, fontWeight: 500, lineHeight: 1 };

const NAV_LINKS = [
  { href: "#team", text: "Team" },
  { href: "#capabilities", text: "Capabilities" },
  { href: "#stack", text: "Stack" },
];

export default function Nav({ teamName }) {
  return (
    <div className="nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, display: "flex",
      alignItems: "center", gap: 28, padding: "22px 36px",
      background: "linear-gradient(#000000 55%, rgba(0,0,0,0))",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
        {/* Registration mark */}
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: "block" }} aria-hidden="true">
          <circle cx="9" cy="9" r="5" fill="none" stroke={C.line} strokeWidth="1" />
          <path d="M9 0v18M0 9h18" stroke={C.line} strokeWidth="1" />
          <circle cx="9" cy="9" r="1.6" fill={C.signal} />
        </svg>
        <span style={{ ...link, fontWeight: 600, color: C.paper }}>{teamName}</span>
      </div>

      {NAV_LINKS.map((l) => (
        <motion.a key={l.href} href={l.href} className="nav-link"
          style={{ ...link, color: C.dim }}
          whileHover={{ color: C.paper }}
          transition={HOVER_INSTANT}
        >{l.text}</motion.a>
      ))}

      <PushButton href="#contact" size="sm">Contact us</PushButton>
    </div>
  );
}
