// Originally ported from "Team Portfolio v2.dc.html" (arm, gears, conveyor);
// models 3–8 were added so every team member gets their own object. `cloud()`
// emits {dur, offset} instead of a CSS animation shorthand for AmbientField.
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
// Tilt about a line parallel to the x axis through (·, py, pz).
function rotX(X, Y, Z, a, py, pz, o) {
  const c = Math.cos(a), s = Math.sin(a), y = Y - py, z = Z - pz;
  o[0] = X; o[1] = py + y * c - z * s; o[2] = pz + y * s + z * c;
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
    const p = axis === "y" ? [ox + c, oy, oz + s] : axis === "x" ? [ox, oy + c, oz + s] : [ox + c, oy + s, oz];
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
function line(a, b, g, out) { out.push({ a: a, b: b, g: g }); }
// Rectangle in a z = const plane.
function rectZ(x0, y0, x1, y1, z, g, out) {
  line([x0, y0, z], [x1, y0, z], g, out); line([x1, y0, z], [x1, y1, z], g, out);
  line([x1, y1, z], [x0, y1, z], g, out); line([x0, y1, z], [x0, y0, z], g, out);
}

// Each model: build() → segments, frame(t) → per-frame state, and
// place(g, pt, state, out) → where a local point of group g sits right now.
// A segment may carry `ga`/`gb` when its two ends belong to different groups.

// ── model 0 — six-axis arm. groups: 0 base, 1 upper arm, 2 forearm, 3 gripper
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

// ── model 1 — meshing gear pair
const GEAR_G = [{ cx: -0.52, cy: 0.2, dir: 1, spd: 0.5 }, { cx: 0.56, cy: -0.16, dir: -1, spd: 0.83 }];
const GEARS = {
  build() {
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
  },
  frame: (t) => t,
  place(g, pt, t, o) {
    const G = GEAR_G[g], a = G.dir * t * G.spd;
    const v = rot2(pt[0] - G.cx, pt[1] - G.cy, a);
    o[0] = G.cx + v[0]; o[1] = G.cy + v[1]; o[2] = pt[2];
  },
};

// ── model 2 — conveyor line. groups: 0 frame, 1..3 crates
const CONVEYOR = {
  build() {
    const s = [];
    boxEdges(2.4, 0.12, 0.8, 0, 0, 0, 0, s);
    boxEdges(2.4, 0.2, 0.06, 0, 0.07, 0.43, 0, s);
    boxEdges(2.4, 0.2, 0.06, 0, 0.07, -0.43, 0, s);
    for (let k = 0; k < 5; k++) cylEdges("z", 0.13, 0.78, -0.96 + k * 0.48, -0.12, 0, 0, s, 12);
    boxEdges(0.1, 0.78, 0.1, -0.96, -0.64, 0, 0, s);
    boxEdges(0.1, 0.78, 0.1, 0.96, -0.64, 0, 0, s);
    for (let k = 0; k < 3; k++) boxEdges(0.34, 0.34, 0.34, -0.9 + k * 0.9, 0.29, 0, 1 + k, s);
    return s;
  },
  frame(t) {
    const out = [];
    for (let k = 0; k < 3; k++) {
      const base = -0.9 + k * 0.9;
      const nc = (((base + t * 0.34 + 1.35) % 2.7) + 2.7) % 2.7 - 1.35;
      out.push(nc - base);
    }
    return out;
  },
  place(g, pt, off, o) {
    o[0] = pt[0] + (g > 0 ? off[g - 1] : 0); o[1] = pt[1] - 0.12; o[2] = pt[2];
  },
};

// ── model 3 — vision gantry. groups: 0 frame + tray + parts, 1 carriage, camera and view cone
const VISION = {
  build() {
    const s = [];
    boxEdges(2.4, 0.08, 1.0, 0, -0.8, 0, 0, s);
    for (let k = 0; k < 4; k++) boxEdges(0.2, 0.2, 0.2, -0.9 + k * 0.6, -0.66, (k % 2 ? 0.18 : -0.14), 0, s);
    for (const x of [-1.2, 1.2]) for (const z of [-0.45, 0.45]) boxEdges(0.08, 1.84, 0.08, x, 0.12, z, 0, s);
    boxEdges(2.48, 0.08, 0.08, 0, 1.04, -0.45, 0, s);
    boxEdges(2.48, 0.08, 0.08, 0, 1.04, 0.45, 0, s);
    // carriage + camera
    boxEdges(0.12, 0.08, 0.98, 0, 1.04, 0, 1, s);
    boxEdges(0.28, 0.32, 0.3, 0, 0.8, 0, 1, s);
    cylEdges("y", 0.1, 0.12, 0, 0.52, 0, 1, s, 14);
    const lens = [0, 0.52, 0], fy = -0.75, fx = 0.4, fz = 0.42;
    const corners = [[-fx, fy, -fz], [fx, fy, -fz], [fx, fy, fz], [-fx, fy, fz]];
    for (let k = 0; k < 4; k++) {
      line(lens, corners[k], 1, s);
      line(corners[k], corners[(k + 1) % 4], 1, s);
    }
    line([-fx, fy, 0], [fx, fy, 0], 1, s);
    return s;
  },
  frame: (t) => 0.82 * Math.sin(t * 0.45),
  place(g, pt, x, o) {
    o[0] = pt[0] + (g === 1 ? x : 0); o[1] = pt[1] - 0.1; o[2] = pt[2];
  },
};

// ── model 4 — control board, tilted to face the viewer. groups: 0 board, 1 fan rotor
const FAN = { x: 0.6, y: 0.36, z: 0.3 };
const BOARD_TILT = -1.05;
const BOARD = {
  build() {
    const s = [];
    const top = 0.03;
    boxEdges(2.0, 0.06, 1.3, 0, 0, 0, 0, s);
    for (const [x, z] of [[-0.9, -0.55], [0.9, -0.55], [-0.9, 0.55], [0.9, 0.55]]) ring("y", 0.045, 10, x, top, z, 0, s);
    // MCU with pins on all four sides
    const mx = -0.35, mz = -0.1, mh = 0.21;
    boxEdges(0.42, 0.07, 0.42, mx, top + 0.035, mz, 0, s);
    for (let k = 0; k < 6; k++) {
      const d = -0.16 + k * 0.064;
      line([mx - mh, top, mz + d], [mx - mh - 0.07, top, mz + d], 0, s);
      line([mx + mh, top, mz + d], [mx + mh + 0.07, top, mz + d], 0, s);
      line([mx + d, top, mz - mh], [mx + d, top, mz - mh - 0.07], 0, s);
      line([mx + d, top, mz + mh], [mx + d, top, mz + mh + 0.07], 0, s);
    }
    boxEdges(0.22, 0.06, 0.14, 0.2, top + 0.03, -0.38, 0, s);
    boxEdges(0.22, 0.06, 0.14, 0.2, top + 0.03, 0.0, 0, s);
    cylEdges("y", 0.06, 0.18, 0.62, top, -0.42, 0, s, 10);
    cylEdges("y", 0.06, 0.18, 0.8, top, -0.42, 0, s, 10);
    cylEdges("y", 0.045, 0.12, 0.62, top, -0.2, 0, s, 10);
    // header
    boxEdges(0.9, 0.1, 0.12, -0.35, top + 0.05, 0.5, 0, s);
    for (let k = 0; k < 8; k++) line([-0.74 + k * 0.11, top + 0.1, 0.5], [-0.74 + k * 0.11, top + 0.22, 0.5], 0, s);
    // traces
    const tr = (pts) => { for (let k = 0; k < pts.length - 1; k++) line([pts[k][0], top, pts[k][1]], [pts[k + 1][0], top, pts[k + 1][1]], 0, s); };
    tr([[-0.07, -0.18], [0.02, -0.18], [0.09, -0.38]]);
    tr([[-0.07, -0.02], [0.09, -0.02], [0.09, 0.0]]);
    tr([[0.31, -0.38], [0.5, -0.38], [0.56, -0.42]]);
    tr([[-0.43, 0.18], [-0.43, 0.3], [-0.52, 0.44]]);
    tr([[-0.27, 0.18], [-0.27, 0.3], [-0.19, 0.44]]);
    tr([[0.31, 0.0], [0.4, 0.12], [0.4, 0.3]]);
    // heatsink + fins
    boxEdges(0.5, 0.05, 0.5, FAN.x, top + 0.025, FAN.z, 0, s);
    for (let k = 0; k < 5; k++) boxEdges(0.02, 0.2, 0.46, FAN.x - 0.2 + k * 0.1, top + 0.15, FAN.z, 0, s);
    // fan rotor
    ring("y", 0.22, 22, FAN.x, FAN.y, FAN.z, 1, s);
    ring("y", 0.06, 10, FAN.x, FAN.y, FAN.z, 1, s);
    for (let k = 0; k < 5; k++) {
      const a = (k * 2 * Math.PI) / 5;
      line([FAN.x + Math.cos(a) * 0.06, FAN.y, FAN.z + Math.sin(a) * 0.06],
           [FAN.x + Math.cos(a + 0.5) * 0.21, FAN.y, FAN.z + Math.sin(a + 0.5) * 0.21], 1, s);
    }
    return s;
  },
  frame: (t) => t * 2.4,
  place(g, pt, spin, o) {
    let X = pt[0], Z = pt[2];
    if (g === 1) { const v = rot2(X - FAN.x, Z - FAN.z, spin); X = FAN.x + v[0]; Z = FAN.z + v[1]; }
    rotX(X, pt[1], Z, BOARD_TILT, 0, 0, o);
  },
};

// ── model 5 — throughput columns. groups: 0 floor/axes/target, 1.. one per bar (unit height)
const BAR_COLS = 6;
const BARS = {
  build() {
    const s = [];
    const fy = 0;
    line([-1.25, fy, -0.5], [1.25, fy, -0.5], 0, s); line([-1.25, fy, 0.5], [1.25, fy, 0.5], 0, s);
    line([-1.25, fy, -0.5], [-1.25, fy, 0.5], 0, s); line([1.25, fy, -0.5], [1.25, fy, 0.5], 0, s);
    for (let k = 1; k < BAR_COLS; k++) { const x = -1.25 + k * (2.5 / BAR_COLS); line([x, fy, -0.5], [x, fy, 0.5], 0, s); }
    line([-1.3, 0, 0.5], [-1.3, 1.5, 0.5], 0, s);
    for (let k = 1; k <= 5; k++) line([-1.36, k * 0.3, 0.5], [-1.3, k * 0.3, 0.5], 0, s);
    for (let k = 0; k < 14; k++) { const x0 = -1.25 + k * 0.18; line([x0, 1.12, 0.3], [x0 + 0.1, 1.12, 0.3], 0, s); }
    for (let row = 0; row < 2; row++) {
      for (let k = 0; k < BAR_COLS; k++) {
        boxEdges(0.22, 1, 0.22, -1.04 + k * (2.08 / (BAR_COLS - 1)), 0.5, row ? 0.2 : -0.2, 1 + row * BAR_COLS + k, s);
      }
    }
    return s;
  },
  frame(t) {
    const h = [];
    for (let row = 0; row < 2; row++) for (let k = 0; k < BAR_COLS; k++) {
      h.push(row
        ? 0.5 + 0.13 * k + 0.18 * Math.sin(t * 0.5 + k * 0.7 + 1.6)
        : 0.32 + 0.1 * k + 0.16 * Math.sin(t * 0.62 + k * 0.9));
    }
    return h;
  },
  place(g, pt, h, o) {
    const Y = g > 0 ? pt[1] * h[g - 1] : pt[1];
    rotX(pt[0], Y - 0.78, pt[2], -0.32, -0.2, 0, o);
  },
};

// ── model 6 — neural network. groups: layer index; each layer turns about the x axis
const NN_X = [-1.1, -0.37, 0.37, 1.1];
const NN_N = [3, 5, 5, 2];
const NN_R = [0.5, 0.58, 0.58, 0.3];
const NEURAL = {
  build() {
    const s = [];
    const nodes = NN_X.map((x, L) => {
      const pts = [];
      for (let j = 0; j < NN_N[L]; j++) {
        const a = (j / NN_N[L]) * Math.PI * 2 + L * 0.4;
        pts.push([x, Math.cos(a) * NN_R[L], Math.sin(a) * NN_R[L]]);
      }
      return pts;
    });
    nodes.forEach((pts, L) => {
      ring("x", NN_R[L] + 0.16, 28, NN_X[L], 0, 0, L, s);
      pts.forEach((p) => boxEdges(0.1, 0.1, 0.1, p[0], p[1], p[2], L, s));
      if (L < nodes.length - 1) {
        pts.forEach((p) => nodes[L + 1].forEach((q) => s.push({ a: p, b: q, g: L, ga: L, gb: L + 1 })));
      }
    });
    return s;
  },
  frame(t) {
    return NN_X.map((_, L) => (L % 2 ? -1 : 1) * t * 0.22 + 0.35 * Math.sin(t * 0.5 + L));
  },
  place(g, pt, ang, o) {
    const v = rot2(pt[1], pt[2], ang[g]);
    o[0] = pt[0]; o[1] = v[0]; o[2] = v[1];
  },
};

// ── model 7 — operator console. groups: 0 pedestal, 1 panel, 2 scan line, 3 slider knob, 4 e-stop
const PANEL = { tilt: 0.45, y: 0.45, z: 0.05 };
const CONSOLE = {
  build() {
    const s = [];
    boxEdges(0.95, 0.05, 0.6, 0, -0.92, 0.1, 0, s);
    boxEdges(0.45, 0.9, 0.35, 0, -0.45, 0.1, 0, s);
    // panel, in its own frame (face toward viewer at z = -0.035)
    const f = -0.04;
    boxEdges(1.8, 1.1, 0.07, 0, 0, 0, 1, s);
    rectZ(-0.62, -0.2, 0.62, 0.44, f, 1, s);
    line([-0.54, 0.34, f], [-0.1, 0.34, f], 1, s);
    line([-0.54, 0.24, f], [-0.24, 0.24, f], 1, s);
    line([-0.54, 0.14, f], [-0.16, 0.14, f], 1, s);
    rectZ(-0.54, -0.12, -0.1, 0.06, f, 1, s);
    const chart = [[0.02, -0.1], [0.14, 0.0], [0.24, -0.04], [0.36, 0.14], [0.46, 0.1], [0.56, 0.32]];
    for (let k = 0; k < chart.length - 1; k++) line([chart[k][0], chart[k][1], f], [chart[k + 1][0], chart[k + 1][1], f], 1, s);
    for (let k = 0; k < 3; k++) ring("z", 0.06, 14, -0.62 + k * 0.2, -0.38, f, 1, s);
    line([0.0, -0.38, f], [0.44, -0.38, f], 1, s);
    ring("z", 0.13, 20, 0.72, -0.34, f, 1, s);
    line([-0.62, -0.2, f], [0.62, -0.2, f], 2, s);
    boxEdges(0.05, 0.1, 0.04, 0.0, -0.38, f - 0.02, 3, s);
    cylEdges("z", 0.1, 0.1, 0.72, -0.34, f - 0.07, 4, s, 16);
    return s;
  },
  frame(t) {
    return {
      scan: 0.64 * ((t * 0.32) % 1),
      knob: 0.44 * (0.5 + 0.5 * Math.sin(t * 0.8)),
      press: 0.04 * Math.max(0, Math.sin(t * 1.1) - 0.6) / 0.4,
    };
  },
  place(g, pt, st, o) {
    if (g === 0) { o[0] = pt[0]; o[1] = pt[1] + 0.1; o[2] = pt[2]; return; }
    let X = pt[0], Y = pt[1], Z = pt[2];
    if (g === 2) Y += st.scan;
    else if (g === 3) X += st.knob;
    else if (g === 4) Z += st.press;
    rotX(X, Y, Z, PANEL.tilt, 0, 0, o);
    o[1] += PANEL.y; o[2] += PANEL.z;
  },
};

// ── model 8 — delta picker. groups: 0 frame + table, 1 effector,
// 10+i upper arm i, 20+i lower rods i. Arm points are symbolic: pt[0] picks
// shoulder (0) / elbow (1) / effector joint (2), pt[1] is the side offset.
const DELTA = { top: 1.0, rb: 0.6, re: 0.18, l1: 0.7, l2: 1.3, th: [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3] };
const DELTA_ROBOT = {
  build() {
    const s = [];
    ring("y", 0.9, 3, 0, DELTA.top, 0, 0, s);
    ring("y", 0.3, 20, 0, DELTA.top, 0, 0, s);
    ring("y", 0.3, 20, 0, DELTA.top + 0.1, 0, 0, s);
    boxEdges(1.9, 0.04, 1.2, 0, -0.78, 0, 0, s);
    for (const [x, z] of [[-0.55, 0.25], [0.2, -0.3], [0.6, 0.35]]) boxEdges(0.14, 0.1, 0.14, x, -0.71, z, 0, s);
    DELTA.th.forEach((th, i) => {
      const cx = Math.cos(th) * DELTA.rb, cz = Math.sin(th) * DELTA.rb;
      boxEdges(0.18, 0.18, 0.18, cx, DELTA.top + 0.05, cz, 0, s);
      for (const side of [-1, 1]) {
        s.push({ a: [0, side, 0], b: [1, side, 0], g: 10 + i, len: DELTA.l1 });
        s.push({ a: [1, side, 0], b: [2, side, 0], g: 20 + i, len: DELTA.l2 });
      }
      s.push({ a: [1, -1, 0], b: [1, 1, 0], g: 20 + i, len: 0.16 });
      s.push({ a: [2, -1, 0], b: [2, 1, 0], g: 20 + i, len: 0.16 });
    });
    ring("y", 0.24, 3, 0, 0, 0, 1, s);
    ring("y", 0.12, 14, 0, 0, 0, 1, s);
    cylEdges("y", 0.05, 0.15, 0, -0.15, 0, 1, s, 8);
    return s;
  },
  frame(t) {
    const P = [0.34 * Math.cos(t * 0.8), -0.5 + 0.1 * Math.sin(t * 1.6), 0.34 * Math.sin(t * 0.8)];
    const arms = DELTA.th.map((th) => {
      const u = [Math.cos(th), 0, Math.sin(th)], tg = [-Math.sin(th), 0, Math.cos(th)];
      const S = [DELTA.rb * u[0], DELTA.top, DELTA.rb * u[2]];
      const E = [P[0] + DELTA.re * u[0], P[1], P[2] + DELTA.re * u[2]];
      const D = [S[0] - E[0], S[1] - E[1], S[2] - E[2]];
      const A = 2 * DELTA.l1 * (D[0] * u[0] + D[2] * u[2]);
      const B = 2 * DELTA.l1 * D[1];
      const C = DELTA.l2 * DELTA.l2 - (D[0] * D[0] + D[1] * D[1] + D[2] * D[2]) - DELTA.l1 * DELTA.l1;
      const base = Math.atan2(B, A), d = Math.acos(Math.max(-1, Math.min(1, C / Math.hypot(A, B))));
      // Of the two elbow solutions, take the one that swings outward.
      const phi = Math.cos(base + d) > Math.cos(base - d) ? base + d : base - d;
      const El = [S[0] + DELTA.l1 * Math.cos(phi) * u[0], S[1] + DELTA.l1 * Math.sin(phi), S[2] + DELTA.l1 * Math.cos(phi) * u[2]];
      return { pts: [S, El, E], tg: tg };
    });
    return { P: P, arms: arms };
  },
  place(g, pt, st, o) {
    if (g >= 10) {
      const arm = st.arms[g % 10], q = arm.pts[pt[0]], w = pt[1] * (g < 20 ? 0.05 : 0.08);
      o[0] = q[0] + arm.tg[0] * w; o[1] = q[1] - 0.15; o[2] = q[2] + arm.tg[2] * w;
      return;
    }
    const off = g === 1 ? st.P : [0, 0, 0];
    o[0] = pt[0] + off[0]; o[1] = pt[1] + off[1] - 0.15; o[2] = pt[2] + off[2];
  },
};

function makeModel(def) {
  const segs = def.build();
  const lens = segs.map((e) => e.len ?? Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1], e.b[2] - e.a[2]));
  return { def: def, segs: segs, lens: lens, total: lens.reduce((a, b) => a + b, 0), ep: new Float64Array(segs.length * 6), samp: null };
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
const TMP = [0, 0, 0];
export function transformModel(mi, t) {
  const M = MODELS[mi];
  const st = M.def.frame(t);
  const EP = M.ep;
  for (let s = 0; s < M.segs.length; s++) {
    const e = M.segs[s], o = s * 6;
    M.def.place(e.ga ?? e.g, e.a, st, TMP);
    EP[o] = TMP[0]; EP[o + 1] = TMP[1]; EP[o + 2] = TMP[2];
    M.def.place(e.gb ?? e.g, e.b, st, TMP);
    EP[o + 3] = TMP[0]; EP[o + 4] = TMP[1]; EP[o + 5] = TMP[2];
  }
  return M;
}

export const MODEL_N = 900;
export const MODELS = [ARM, GEARS, CONVEYOR, VISION, BOARD, BARS, NEURAL, CONSOLE, DELTA_ROBOT].map(makeModel);
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

// Scroll position (in viewport units) → which model, and the morph through
// scatter. Snap rests: hero 0, members 1–7, capabilities 8, stack 9, contact 10.
// The active member flips when its rail trigger crosses the viewport midline
// (member n owns n + 0.5 … n + 1.5), so each morph is centred on that flip and
// every resting position shows a whole model.
const MEMBER_MODELS = [
  1, // Tian Wen — gears
  3, // Jovyan — vision gantry
  4, // Vincent Santosa — control board
  5, // Davina Nadine — throughput columns
  6, // Cliffton Owen — neural network
  7, // Brian Wong — operator console
  8, // Wen Xuan — delta picker
];
const SPANS = [
  { until: 0.5, mi: 0 },
  ...MEMBER_MODELS.map((mi, n) => ({ until: n + 1.5, mi: mi })),
  { until: 9.5, mi: 2 },
  { until: Infinity, mi: 0 },
];
const MORPH_W = 0.3;
export function stageAt(y) {
  for (let i = 0; i < SPANS.length - 1; i++) {
    const at = SPANS[i].until;
    if (y > at - MORPH_W && y < at + MORPH_W) {
      return { from: SPANS[i].mi, to: SPANS[i + 1].mi, p: (y - (at - MORPH_W)) / (2 * MORPH_W) };
    }
  }
  const mi = SPANS.find((sp) => y < sp.until).mi;
  return { from: mi, to: mi, p: 0 };
}
