import { motion } from "framer-motion";
import { MEMBERS, pad } from "../data.js";
import { HOVER_INSTANT } from "../motion/presets.js";

export default function Contact({ teamName }) {
  return (
    <section id="contact" data-screen-label="Contact" style={{
      position: "relative", zIndex: 1, minHeight: "100vh", scrollSnapAlign: "start",
      display: "grid", gridTemplateRows: "1fr auto", gap: 36,
      padding: "120px 36px 36px", maxWidth: 1280, margin: "0 auto",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 60, alignItems: "center",
      }}>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
            color: "#ffb829", marginBottom: 30,
          }}>Contact</div>
          <h2 style={{
            fontSize: "clamp(44px, 6.4vw, 96px)", lineHeight: 1.05,
            letterSpacing: "-0.022em", fontWeight: 400, margin: "0 0 30px",
          }}>Bring us a problem</h2>
          <p style={{
            fontSize: 18, fontWeight: 300, lineHeight: 1.55, color: "#bdbdbd",
            maxWidth: 480, margin: "0 0 36px",
          }}>
            Tell us where the line slows down, what fails inspection, or what still runs by hand.
            We will scope it, build it, and hand it over working.
          </p>
          {/* style-hover="background: #6f3ff5" */}
          <motion.a href="mailto:team@example.edu"
            style={{
              display: "inline-block", background: "#8052ff", color: "#ffffff", fontSize: 14,
              fontWeight: 600, letterSpacing: "0.35px", textTransform: "uppercase",
              padding: "15px 18px", borderRadius: 24, lineHeight: 1,
            }}
            whileHover={{ backgroundColor: "#6f3ff5" }}
            transition={HOVER_INSTANT}
          >team@example.edu</motion.a>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.35px", textTransform: "uppercase", color: "#9a9a9a",
          }}>The team</div>
          {MEMBERS.map((m, n) => (
            <div key={m.name} style={{
              display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)",
              gap: 18, alignItems: "baseline",
            }}>
              <span style={{ fontSize: 12, color: "#8052ff" }}>{pad(n)}</span>
              <span style={{ fontSize: 24, lineHeight: 1.25, letterSpacing: "-0.48px", fontWeight: 400 }}>
                {m.name} <span style={{ fontSize: 14, fontWeight: 300, color: "#9a9a9a" }}>{m.role}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        fontSize: 12, lineHeight: 1.5, color: "#9a9a9a",
      }}>
        <span>{teamName}</span>
        <span>Automation · Robotics · Capstone 2026</span>
      </div>
    </section>
  );
}
