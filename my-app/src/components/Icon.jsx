import { C } from "../theme.js";

/**
 * The line icons revise.md calls for on the overview cards and the timeline.
 * Hand-drawn rather than pulled from a set, for the same reason Nav draws its
 * own registration mark: one dependency-free house style, and the stroke picks
 * up whatever colour the caller sets.
 */
const PATHS = {
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
      <path d="M14 21V10h4a1 1 0 0 1 1 1v10" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="7.5" r="3" />
      <path d="M7 20a5 5 0 0 1 10 0" />
      <circle cx="4.5" cy="10.5" r="2" />
      <path d="M1 18.6a3.6 3.6 0 0 1 3.3-3.5" />
      <circle cx="19.5" cy="10.5" r="2" />
      <path d="M23 18.6a3.6 3.6 0 0 0-3.3-3.5" />
    </>
  ),
  documentCheck: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 14.4l2 2 4-4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4.5v16" />
      <path d="M8 20.5h8" />
      <path d="M4 7.5h16" />
      <circle cx="12" cy="3.4" r="1.1" />
      <path d="M1 13.5l3-6 3 6a3 3 0 0 1-6 0z" />
      <path d="M17 13.5l3-6 3 6a3 3 0 0 1-6 0z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.6 8.4l-2.1 5.5-5.5 2.1 2.1-5.5z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 21.6s7.6-3.8 7.6-9.6V5.2L12 2.4 4.4 5.2v6.8c0 5.8 7.6 9.6 7.6 9.6z" />
      <path d="M9 12l2.2 2.2L15.4 10" />
    </>
  ),
  envelope: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3.2 6.6l8.8 6.4 8.8-6.4" />
    </>
  ),
  documentPen: (
    <>
      <path d="M19 11.5V8l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.5" />
      <path d="M14 3v5h5" />
      <path d="M20.6 14.3l-5.1 5.1-2.6.7.7-2.6 5.1-5.1a1.35 1.35 0 0 1 1.9 1.9z" />
    </>
  ),
  verified: (
    <>
      <path d="M12 2.4l2.4 1.9 3-.3 1 2.9 2.6 1.6-1.1 2.8 1.1 2.8-2.6 1.6-1 2.9-3-.3L12 21.6l-2.4-1.9-3 .3-1-2.9L3 15.4l1.1-2.8L3 9.8l2.6-1.6 1-2.9 3 .3z" />
      <path d="M9 12.1l2.2 2.2 4-4.4" />
    </>
  ),
  magnifier: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8L21 21" />
    </>
  ),
  gears: (
    <>
      <circle cx="10.5" cy="10.5" r="3" />
      <path d="M10.5 4v2M10.5 15v2M4 10.5h2M15 10.5h2M5.9 5.9l1.4 1.4M13.7 13.7l1.4 1.4M15.1 5.9l-1.4 1.4M7.3 13.7l-1.4 1.4" />
      <circle cx="17.6" cy="17.6" r="2" />
      <path d="M17.6 13.6v1.2M17.6 20.4v1.6M13.6 17.6h1.2M20.4 17.6h1.6" />
    </>
  ),
};

export default function Icon({ name, size = 28, color = C.accent }) {
  const d = PATHS[name];
  if (!d) return null;

  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flex: "none" }}
    >
      {d}
    </svg>
  );
}
