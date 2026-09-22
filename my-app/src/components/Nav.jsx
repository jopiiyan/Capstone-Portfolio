import { motion } from "framer-motion";
import { EASE_OUT, HOVER_INSTANT } from "../motion/presets.js";
import PushButton from "./PushButton.jsx";
import { BODY, C } from "../theme.js";

const link = { fontFamily: BODY, fontSize: 16, fontWeight: 500, lineHeight: 1 };

const TABS = [
  { id: "overview", label: "Capstone Overview" },
  { id: "team", label: "Team & Projects" },
];

// These all point at sections that live on the team tab.
const NAV_LINKS = [
  { href: "#team", text: "Team" },
  { href: "#capabilities", text: "Capabilities" },
  { href: "#stack", text: "Stack" },
];

export default function Nav({ teamName, tab, onTab }) {
  // On the team tab these anchors resolve natively. From the overview tab the
  // target does not exist yet, so the tab switch has to carry the anchor with it.
  const onLink = (e, href) => {
    if (tab === "team") return;
    e.preventDefault();
    onTab("team", href);
  };

  return (
    <div className="nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, display: "flex",
      alignItems: "center", gap: 28, padding: "22px 36px",
      background: "linear-gradient(var(--canvas) 55%, transparent)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Registration mark */}
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: "block" }} aria-hidden="true">
          <circle cx="9" cy="9" r="5" fill="none" stroke={C.line} strokeWidth="1" />
          <path d="M9 0v18M0 9h18" stroke={C.line} strokeWidth="1" />
          <circle cx="9" cy="9" r="1.6" fill={C.signal} />
        </svg>
        <span style={{ ...link, fontWeight: 600, color: C.paper }}>{teamName}</span>
      </div>

      {/* Underlined rather than boxed: the nav already carries a filled button
          for Contact, and a second filled control beside it fought with it. */}
      <div className="tabs" style={{ display: "flex", gap: 26, marginRight: "auto" }}>
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} type="button" aria-current={on ? "page" : undefined}
              onClick={() => onTab(t.id)}
              style={{
                ...link, position: "relative", padding: "7px 0",
                fontWeight: on ? 600 : 500, color: on ? C.paper : C.dim,
                background: "transparent", border: "none", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
              {on && (
                <motion.span layoutId="tab-underline" aria-hidden="true"
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  style={{
                    position: "absolute", left: 0, right: 0, bottom: 0,
                    height: 2, background: C.accent,
                  }} />
              )}
            </button>
          );
        })}
      </div>

      {NAV_LINKS.map((l) => (
        <motion.a key={l.href} href={l.href} className="nav-link"
          style={{ ...link, color: C.dim }}
          whileHover={{ color: C.paper }}
          transition={HOVER_INSTANT}
          onClick={(e) => onLink(e, l.href)}
        >{l.text}</motion.a>
      ))}

      <PushButton href="#contact" size="sm">Contact us</PushButton>
    </div>
  );
}
