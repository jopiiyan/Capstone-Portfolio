// Originally ported from "Team Portfolio v2.dc.html". Only the six-axis arm
// survives: the hero shows it assembled, and the Meet-the-Team section bursts
// it into the particle cloud it was sampled from. The seven per-member models
// (gears, gantry, board, bars, network, console, delta picker) were removed
// along with the SVG ambient field they shared helpers with.
import { PARTICLE_COLORS } from "../data.js";

export function rand(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rot2(x, y, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
}

// ── wire model: edges, not surfaces ─────────────────────────────────
function boxEdges(w, h, d, ox, oy, oz, g, out) {
  const X = w / 2, Y = h / 2, Z = d / 2, c = [];
  for (let i = 0; i < 8; i++) c.push([ox + ((i & 1) ? X : -X), oy + ((i & 2) ? Y : -Y), oz + ((i & 4) ? Z : -Z)]);
  const E = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
  for (let i = 0; i < E.length; i++) out.push({ a: c[E[i][0]], b: c[E[i][1]], g: g });
}
function ring(axis, radius, n, ox, oy, oz, g, out) {
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const th = (i / n) * Math.PI * 2;
    const c = Math.cos(th) * radius, s = Math.sin(th) * radius;
    const p = axis === "y" ? [ox + c, oy, oz + s] : [ox + c, oy + s, oz];
    if (prev) out.push({ a: prev, b: p, g: g });
    prev = p;
  }
}
function cylEdges(axis, radius, len, ox, oy, oz, g, out, n) {
  n = n || 16;
  if (axis === "y") {
    ring("y", radius, n, ox, oy, oz, g, out);
    ring("y", radius, n, ox, oy + len, oz, g, out);
    for (let k = 0; k < 4; k++) {
      const th = (k * Math.PI) / 2, c = Math.cos(th) * radius, s = Math.sin(th) * radius;
      out.push({ a: [ox + c, oy, oz + s], b: [ox + c, oy + len, oz + s], g: g });
    }
  } else {
    ring("z", radius, n, ox, oy, oz - len / 2, g, out);
    ring("z", radius, n, ox, oy, oz + len / 2, g, out);
    for (let k = 0; k < 4; k++) {
      const th = (k * Math.PI) / 2, c = Math.cos(th) * radius, s = Math.sin(th) * radius;
      out.push({ a: [ox + c, oy + s, oz - len / 2], b: [ox + c, oy + s, oz + len / 2], g: g });
    }
  }
}

// ── six-axis arm. groups: 0 base, 1 upper arm, 2 forearm, 3 gripper ──
function buildArmWire() {
  const s = [];
  cylEdges("y", 0.8, 0.07, 0, 0, 0, 0, s, 26);
  cylEdges("y", 0.5, 0.44, 0, 0.07, 0, 0, s, 22);
  boxEdges(0.56, 0.34, 0.54, 0, 0.68, 0, 0, s);
  cylEdges("z", 0.3, 0.5, 0, 0.86, 0, 0, s, 18);
  boxEdges(0.3, 1, 0.32, 0, 0.5, 0, 1, s);
  cylEdges("z", 0.23, 0.36, 0, 1, 0, 1, s, 16);
  boxEdges(0.26, 0.88, 0.28, 0, 0.44, 0, 2, s);
  cylEdges("z", 0.17, 0.28, 0, 0.88, 0, 2, s, 14);
  boxEdges(0.34, 0.22, 0.3, 0, 0.11, 0, 3, s);
  for (let side = -1; side <= 1; side += 2) {
    const rx = side * 0.15, ry = 0.22, aOut = side * 0.36, aIn = -side * 0.68;
    const jaw = [];
    boxEdges(0.1, 0.46, 0.18, 0, 0.23, 0, 3, jaw);
    for (let i = 0; i < jaw.length; i++) {
      const A = rot2(jaw[i].a[0], jaw[i].a[1], aOut), B = rot2(jaw[i].b[0], jaw[i].b[1], aOut);
      s.push({ a: [rx + A[0], ry + A[1], jaw[i].a[2]], b: [rx + B[0], ry + B[1], jaw[i].b[2]], g: 3 });
    }
    const end = rot2(0, 0.46, aOut);
    const tip = [];
    boxEdges(0.09, 0.36, 0.16, 0, 0.18, 0, 3, tip);
    for (let i = 0; i < tip.length; i++) {
      const A = rot2(tip[i].a[0], tip[i].a[1], aOut + aIn), B = rot2(tip[i].b[0], tip[i].b[1], aOut + aIn);
      s.push({ a: [rx + end[0] + A[0], ry + end[1] + A[1], tip[i].a[2]], b: [rx + end[0] + B[0], ry + end[1] + B[1], tip[i].b[2]], g: 3 });
    }
  }
  return s;
}

export function armFrame(t) {
  const a1 = -0.3 + 0.1 * Math.sin(t * 0.45);
  const a2 = 1.5 + 0.16 * Math.sin(t * 0.37 + 1.1);
  const a3 = 0.55 + 0.14 * Math.sin(t * 0.7 + 0.4);
  const A1 = a1, A2 = a1 + a2, A3 = a1 + a2 + a3;
  const S0 = [0, 0.86];
  const u = rot2(0, 1, A1), E0 = [S0[0] + u[0], S0[1] + u[1]];
  const v = rot2(0, 0.88, A2), W0 = [E0[0] + v[0], E0[1] + v[1]];
  return { A1: A1, A2: A2, A3: A3, S0: S0, E0: E0, W0: W0 };
}

const ARM = {
  build: buildArmWire,
  frame: armFrame,
  place(g, pt, fd, o) {
    let X = pt[0], Y = pt[1], Z = pt[2];
    if (g === 1) { const v = rot2(X, Y, fd.A1); X = fd.S0[0] + v[0]; Y = fd.S0[1] + v[1]; }
    else if (g === 2) { const v = rot2(X, Y, fd.A2); X = fd.E0[0] + v[0]; Y = fd.E0[1] + v[1]; }
    else if (g === 3) { const v = rot2(X, Y, fd.A3); X = fd.W0[0] + v[0]; Y = fd.W0[1] + v[1]; }
    o[0] = X * 0.92; o[1] = (Y - 0.8) * 0.92; o[2] = Z * 0.92;
  },
};

function makeModel(def) {
  const segs = def.build();
  const lens = segs.map((e) => e.len ?? Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1], e.b[2] - e.a[2]));
  return {
    def: def, segs: segs, lens: lens,
    total: lens.reduce((a, b) => a + b, 0),
    ep: new Float64Array(segs.length * 6), samp: null,
  };
}

// Spread n particles evenly along the model's total edge length.
function sampleOn(m, n, r) {
  const out = [];
  for (let i = 0; i < n; i++) {
    let pick = r() * m.total, si = 0;
    while (si < m.lens.length - 1 && pick > m.lens[si]) { pick -= m.lens[si]; si++; }
    out.push({ si: si, u: r() });
  }
  return out;
}

export const MODEL_N = 900;
const MODEL = makeModel(ARM);
MODEL.samp = sampleOn(MODEL, MODEL_N, rand(5150));

const TMP = [0, 0, 0];
// Runs the arm's kinematics for time t and writes both ends of every segment
// into the model's flat endpoint buffer. Returns the model itself.
export function transformModel(t) {
  const st = MODEL.def.frame(t);
  const EP = MODEL.ep;
  for (let s = 0; s < MODEL.segs.length; s++) {
    const e = MODEL.segs[s], o = s * 6;
    MODEL.def.place(e.ga ?? e.g, e.a, st, TMP);
    EP[o] = TMP[0]; EP[o + 1] = TMP[1]; EP[o + 2] = TMP[2];
    MODEL.def.place(e.gb ?? e.g, e.b, st, TMP);
    EP[o + 3] = TMP[0]; EP[o + 4] = TMP[1]; EP[o + 5] = TMP[2];
  }
  return MODEL;
}

export function buildAmbient(seed, n) {
  const r = rand(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const z = 0.25 + r() * 0.75;
    out.push({
      x: r(), y: r(), z: z,
      vx: (r() - 0.5) * 0.014 * z, vy: (r() - 0.5) * 0.012 * z,
      size: (1.6 + r() * 4.2) * z,
      spin: r() * Math.PI * 2, spd: (r() - 0.5) * 0.9,
      ph: r() * Math.PI * 2,
      c: PARTICLE_COLORS[Math.floor(r() * PARTICLE_COLORS.length)]
    });
  }
  return out;
}

// Each particle's `s*` is where it flies to once the arm comes apart.
export function buildParticles(seed) {
  const r = rand(seed);
  const out = [];
  for (let i = 0; i < MODEL_N; i++) {
    out.push({
      sx: (r() - 0.5) * 7, sy: (r() - 0.5) * 5.2, sz: (r() - 0.5) * 5.6,
      size: 0.013 + r() * 0.019,
      spin: r() * Math.PI * 2,
      spd: (r() - 0.5) * 1.7,
      ph: r() * Math.PI * 2,
      c: PARTICLE_COLORS[Math.floor(r() * PARTICLE_COLORS.length)]
    });
  }
  return out;
}

// Scroll geometry, in viewport units:
//   0 – 1      hero; the arm comes apart as the hero scrolls away
//   1 – 2.8    Meet the Team; pinned over 1 – 1.8
//   2.8 – 9.8  team stage (seven members), then capabilities, stack, contact
export const MEET_START = 1;
export const MEET_VH = 1.8;

// The burst rides the hero's exit, so the field is already loose by the time
// the section pins and the copy can start straight away — no viewport of
// scrolling spent watching the arm come apart.
const BURST = [0.18, 0.92];

// Section travel, measured from where it pins: the stage unpins at MEET_VH - 1
// and the section is clear at MEET_VH. The copy fades over MEET_EXIT and the
// particles a beat behind it over DUST_EXIT, so the field is last to clear.
export const MEET_EXIT = [0.8, 1.1];
export const DUST_EXIT = [0.9, 1.25];

/** 0 while the arm is whole, 1 once it has fully come apart. */
export function burstAt(y) {
  return Math.max(0, Math.min(1, (y - BURST[0]) / (BURST[1] - BURST[0])));
}

/** How far the Meet-the-Team section has travelled, in viewports. */
export function meetTravelAt(y) {
  return Math.max(0, Math.min(MEET_VH, y - MEET_START));
}
