// Ported verbatim from "Team Portfolio v2.dc.html". The maths is unchanged —
// only `cloud()` differs, emitting {dur, offset} instead of a CSS animation
// shorthand string so AmbientField can hand those to framer-motion.
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

function triangle(cx, cy, s, rot) {
  const pts = [];
  for (let k = 0; k < 3; k++) {
    const a = rot + (k * 2 * Math.PI) / 3;
    pts.push((cx + s * Math.cos(a)).toFixed(2) + "," + (cy + s * Math.sin(a)).toFixed(2));
  }
  return pts.join(" ");
}

function cloud(n, seed, mode) {
  const r = rand(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    let cx, cy, s;
    if (mode === "cloud") {
      const ang = r() * Math.PI * 2;
      const u = r();
      const rad = 8 + 36 * Math.pow(u, 0.62) + (r() < 0.12 ? 10 * r() : 0);
      cx = 50 + rad * Math.cos(ang) * 1.04;
      cy = 50 + rad * Math.sin(ang) * 0.92;
      s = 0.55 + r() * 1.25;
    } else {
      cx = r() * 100;
      cy = r() * 100;
      s = 0.4 + r() * 0.8;
    }
    out.push({
      pts: triangle(cx, cy, s, r() * Math.PI * 2),
      c: PARTICLE_COLORS[Math.floor(r() * PARTICLE_COLORS.length)],
      // was: `${dur}s ease-in-out ${-offset}s infinite alternate twk`
      dur: 4 + r() * 7,
      offset: r() * 9,
    });
  }
  return out;
}

export const AMBIENT_A = cloud(64, 77341, "scatter");
export const AMBIENT_B = cloud(52, 424242, "scatter");

function rot2(x, y, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
}

// ── wire models: edges, not surfaces ────────────────────────────────
function boxEdges(w, h, d, ox, oy, oz, g, out) {
  const X = w / 2, Y = h / 2, Z = d / 2, c = [];
  for (let i = 0; i < 8; i++) c.push([ox + ((i & 1) ? X : -X), oy + ((i & 2) ? Y : -Y), oz + ((i & 4) ? Z : -Z)]);
  const E = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
  for (let i = 0; i < E.length; i++) out.push({ a: c[E[i][0]], b: c[E[i][1]], g: g });
}
function ring(axis, radius, n, ox, oy, oz, g, out, prof) {
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const th = (i / n) * Math.PI * 2;
    const rr = prof ? prof(th) : radius;
    const c = Math.cos(th) * rr, s = Math.sin(th) * rr;
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

// model 0 — six-axis arm. groups: 0 base, 1 upper arm, 2 forearm, 3 gripper
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

// model 1 — meshing gear pair
const GEAR_G = [{ cx: -0.52, cy: 0.2, dir: 1, spd: 0.5 }, { cx: 0.56, cy: -0.16, dir: -1, spd: 0.83 }];
function buildGearWire() {
  const s = [];
  const one = (cx, cy, R0, teeth, tooth, thick, g) => {
    const prof = (th) => { const f = ((th * teeth) / (Math.PI * 2)) % 1; return R0 + (f < 0.5 ? tooth : 0); };
    ring("z", 0, teeth * 4, cx, cy, -thick / 2, g, s, prof);
    ring("z", 0, teeth * 4, cx, cy, thick / 2, g, s, prof);
    ring("z", 0.17, 18, cx, cy, -thick / 2, g, s);
    ring("z", 0.17, 18, cx, cy, thick / 2, g, s);
    for (let k = 0; k < 6; k++) {
      const th = (k * Math.PI) / 3;
      s.push({ a: [cx + Math.cos(th) * 0.17, cy + Math.sin(th) * 0.17, 0], b: [cx + Math.cos(th) * R0, cy + Math.sin(th) * R0, 0], g: g });
    }
  };
  one(GEAR_G[0].cx, GEAR_G[0].cy, 0.7, 18, 0.13, 0.26, 0);
  one(GEAR_G[1].cx, GEAR_G[1].cy, 0.42, 11, 0.12, 0.22, 1);
  return s;
}

// model 2 — conveyor line. groups: 0 frame, 1..3 crates
function buildConvWire() {
  const s = [];
  boxEdges(2.4, 0.12, 0.8, 0, 0, 0, 0, s);
  boxEdges(2.4, 0.2, 0.06, 0, 0.07, 0.43, 0, s);
  boxEdges(2.4, 0.2, 0.06, 0, 0.07, -0.43, 0, s);
  for (let k = 0; k < 5; k++) cylEdges("z", 0.13, 0.78, -0.96 + k * 0.48, -0.12, 0, 0, s, 12);
  boxEdges(0.1, 0.78, 0.1, -0.96, -0.64, 0, 0, s);
  boxEdges(0.1, 0.78, 0.1, 0.96, -0.64, 0, 0, s);
  for (let k = 0; k < 3; k++) boxEdges(0.34, 0.34, 0.34, -0.9 + k * 0.9, 0.29, 0, 1 + k, s);
  return s;
}
function crateOffsets(t) {
  const out = [];
  for (let k = 0; k < 3; k++) {
    const base = -0.9 + k * 0.9;
    const nc = (((base + t * 0.34 + 1.35) % 2.7) + 2.7) % 2.7 - 1.35;
    out.push(nc - base);
  }
  return out;
}

function makeModel(segs) {
  const lens = segs.map((e) => Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1], e.b[2] - e.a[2]));
  return { segs: segs, lens: lens, total: lens.reduce((a, b) => a + b, 0), ep: new Float64Array(segs.length * 6), samp: null };
}
function sampleOn(m, n, r) {
  const out = [];
  for (let i = 0; i < n; i++) {
    let pick = r() * m.total, si = 0;
    while (si < m.lens.length - 1 && pick > m.lens[si]) { pick -= m.lens[si]; si++; }
    out.push({ si: si, u: r() });
  }
  return out;
}
function tp(mi, g, pt, fd, off, EP, o) {
  let X = pt[0], Y = pt[1], Z = pt[2];
  if (mi === 0) {
    if (g === 1) { const v = rot2(X, Y, fd.A1); X = fd.S0[0] + v[0]; Y = fd.S0[1] + v[1]; }
    else if (g === 2) { const v = rot2(X, Y, fd.A2); X = fd.E0[0] + v[0]; Y = fd.E0[1] + v[1]; }
    else if (g === 3) { const v = rot2(X, Y, fd.A3); X = fd.W0[0] + v[0]; Y = fd.W0[1] + v[1]; }
    X *= 0.92; Y = (Y - 0.8) * 0.92; Z *= 0.92;
  } else if (mi === 1) {
    const G = GEAR_G[g], a = G.dir * t_ref.t * G.spd;
    const v = rot2(X - G.cx, Y - G.cy, a); X = G.cx + v[0]; Y = G.cy + v[1];
  } else {
    if (g > 0) X += off[g - 1];
    Y -= 0.12;
  }
  EP[o] = X; EP[o + 1] = Y; EP[o + 2] = Z;
}
const t_ref = { t: 0 };
export function transformModel(mi, t) {
  t_ref.t = t;
  const M = MODELS[mi];
  const fd = mi === 0 ? armFrame(t) : null;
  const off = mi === 2 ? crateOffsets(t) : null;
  const EP = M.ep;
  for (let s = 0; s < M.segs.length; s++) {
    const e = M.segs[s];
    tp(mi, e.g, e.a, fd, off, EP, s * 6);
    tp(mi, e.g, e.b, fd, off, EP, s * 6 + 3);
  }
  return M;
}

export const MODEL_N = 900;
export const MODELS = [makeModel(buildArmWire()), makeModel(buildGearWire()), makeModel(buildConvWire())];
const RS = rand(5150);
MODELS.forEach((m) => { m.samp = sampleOn(m, MODEL_N, RS); });

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

// scroll position (in viewport units) → which model, and the morph through scatter
const MORPHS = [{ at: 1, from: 0, to: 1 }, { at: 8, from: 1, to: 2 }, { at: 10, from: 2, to: 0 }];
const MORPH_W = 0.5;
export function stageAt(y) {
  for (let i = 0; i < MORPHS.length; i++) {
    const m = MORPHS[i];
    if (y > m.at - MORPH_W && y < m.at + MORPH_W) {
      return { from: m.from, to: m.to, p: (y - (m.at - MORPH_W)) / (2 * MORPH_W) };
    }
  }
  const mi = y < 1 ? 0 : y < 8 ? 1 : y < 10 ? 2 : 0;
  return { from: mi, to: mi, p: 0 };
}
