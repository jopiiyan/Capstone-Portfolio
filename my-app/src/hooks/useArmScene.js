import { useEffect, useRef } from "react";
import {
  armFrame, buildAmbient, buildParticles, burstAt, DUST_EXIT, MEET_START, MEET_VH,
  meetTravelAt, transformModel,
} from "../scene/armScene.js";

// The arm and its particles hold this alpha for the whole of the hero and the
// Meet-the-Team pin. Deliberately not `fade`, which sits the ambient field back
// at y = 2 — that is mid-hold, where the particles should be at their fullest.
const ARM_ALPHA = 0.9;

/**
 * The canvas draw loop. Every mutable field is a ref rather than state — this
 * runs at 60fps and must never trigger a render. The axis readout stays an
 * imperative textContent write for the same reason.
 *
 * Two things are drawn: the arm (hero only, coming apart across the
 * Meet-the-Team pin) and the ambient triangle field (always, faint once the
 * arm is gone). Once the burst finishes, the arm's 900 particles and its
 * kinematics are skipped entirely, so the team stage costs the field alone.
 */
export function useArmScene(canvasRef, axisRef) {
  const burstRef = useRef(0);
  const travelRef = useRef(0);
  const heroRef = useRef(1);
  const fadeRef = useRef(0.9);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const parts = buildParticles(9182736);
    const amb = buildAmbient(31415, 170);
    let heroNow = 1;
    let burstNow = null;
    let travelNow = null;
    let fadeNow = null;
    let lastT = 0;
    let tick = 0;
    let box = null;
    let raf = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 600, h = canvas.clientHeight || 600;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      box = { w: w, h: h };
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const onScroll = () => {
      const y = window.scrollY / Math.max(1, window.innerHeight);
      burstRef.current = burstAt(y);
      travelRef.current = meetTravelAt(y);
      // Field sits back as the stage unpins, so the team reads against it.
      fadeRef.current = y < MEET_START + MEET_VH - 1 ? 0.9 : 0.3;
      heroRef.current = Math.max(0, Math.min(1, 1 - y / 0.85));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const t0 = performance.now();
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!ctx || !box) return;
      const t = (now - t0) / 1000;
      fadeNow = fadeNow == null ? fadeRef.current : fadeNow + (fadeRef.current - fadeNow) * 0.08;
      burstNow = burstNow == null ? burstRef.current : burstNow + (burstRef.current - burstNow) * 0.12;
      travelNow = travelNow == null ? travelRef.current : travelNow + (travelRef.current - travelNow) * 0.12;
      ctx.clearRect(0, 0, box.w, box.h);

      const S = Math.min(box.w * 0.62, box.h) / 2.9;
      const cx = box.w * (box.w > 900 ? 0.7 : 0.62), cy = box.h * 0.62;
      // Smoothstep: the particles leave the arm slowly, then let go. Done by
      // the time the hero is gone, so the section opens on a loose field.
      const b = burstNow;
      const kk = b * b * (3 - 2 * b);
      // The field then holds, lit, for the whole pin, and clears only on the
      // way out — a beat behind the copy it was sitting behind.
      const dust = 1 - Math.max(0, Math.min(1, (travelNow - DUST_EXIT[0]) / (DUST_EXIT[1] - DUST_EXIT[0])));
      const bob = Math.sin(t * 0.5) * box.h * 0.014;
      const baseRot = 0.55 * Math.sin(t * 0.19) + 0.12 * Math.sin(t * 0.63) + b * 1.1;
      const cB = Math.cos(baseRot), sB = Math.sin(baseRot);
      const fade = fadeNow;

      heroNow += (heroRef.current - heroNow) * 0.1;
      const hero = heroNow;
      const px1 = [0, 0, 0], px2 = [0, 0, 0];
      const proj = (X, Y, Z, o) => {
        const XR = X * cB + Z * sB, ZR = -X * sB + Z * cB;
        const persp = 4.6 / (4.6 + ZR);
        o[0] = cx + XR * persp * S; o[1] = cy + bob - Y * persp * S; o[2] = persp;
      };

      if (hero > 0.015) {
        const groundY = cy + bob + S * 0.66;
        ctx.strokeStyle = "#9DBBA2";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2 * hero;
        ctx.beginPath();
        ctx.ellipse(cx, groundY, S * 0.98, S * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.14 * hero;
        ctx.beginPath();
        for (let k = 0; k < 28; k++) {
          const a = (k / 28) * Math.PI * 2 + t * 0.18;
          const c1 = Math.cos(a), s1 = Math.sin(a);
          ctx.moveTo(cx + c1 * S * 1.02, groundY + s1 * S * 0.31);
          ctx.lineTo(cx + c1 * S * 1.1, groundY + s1 * S * 0.335);
        }
        ctx.stroke();
        for (let k = 0; k < 2; k++) {
          ctx.globalAlpha = (0.13 - k * 0.04) * hero;
          ctx.beginPath();
          ctx.ellipse(cx, cy + bob - S * 0.1, S * (1.02 + k * 0.22), S * (0.36 + k * 0.12), t * (k ? -0.09 : 0.14), 0, Math.PI * 2);
          ctx.stroke();
        }
        // slow scan sweep over the model
        const sy = cy + bob + (((t * 0.16) % 1) - 0.5) * box.h * 1.1;
        const grad = ctx.createLinearGradient(cx - S * 1.4, 0, cx + S * 1.4, 0);
        grad.addColorStop(0, "rgba(157,187,162,0)");
        grad.addColorStop(0.5, "rgba(157,187,162,1)");
        grad.addColorStop(1, "rgba(157,187,162,0)");
        ctx.globalAlpha = 0.16 * hero;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx - S * 1.4, sy);
        ctx.lineTo(cx + S * 1.4, sy);
        ctx.stroke();
        // pulse at the gripper
        const fdA = armFrame(t);
        const wx = fdA.W0[0] * 0.92, wy = (fdA.W0[1] - 0.8) * 0.92;
        proj(wx, wy, 0, px1);
        for (let k = 0; k < 2; k++) {
          const ph = ((t * 0.5 + k * 0.5) % 1);
          ctx.globalAlpha = (1 - ph) * 0.35 * hero;
          ctx.strokeStyle = "#F2B705";
          ctx.beginPath();
          ctx.arc(px1[0], px1[1], 6 + ph * S * 0.3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (axisRef.current && hero > 0.05 && (tick = tick + 1) % 6 === 0) {
        const fdB = armFrame(t);
        const deg = (v) => { const d = v * 57.2958; return ((d < 0 ? "−" : "+") + Math.abs(d).toFixed(1)).padStart(6, " "); };
        axisRef.current.textContent = "J1 " + deg(fdB.A1) + "°    J2 " + deg(fdB.A2) + "°    J3 " + deg(fdB.A3) + "°";
      }

      // Below the Meet-the-Team pin there is no arm left to draw at all.
      if (dust > 0.012) {
        const M = transformModel(t);
        const EP = M.ep;

        const la = (1 - kk) * ARM_ALPHA * 0.42;
        if (la > 0.012) {
          ctx.globalAlpha = la;
          ctx.strokeStyle = "#9DBBA2";
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let s = 0; s < M.segs.length; s++) {
            const o6 = s * 6;
            proj(EP[o6], EP[o6 + 1], EP[o6 + 2], px1);
            proj(EP[o6 + 3], EP[o6 + 4], EP[o6 + 5], px2);
            ctx.moveTo(px1[0], px1[1]);
            ctx.lineTo(px2[0], px2[1]);
          }
          ctx.stroke();
        }

        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          const sp = M.samp[i], s6 = sp.si * 6, u = sp.u;
          let X = EP[s6] + (EP[s6 + 3] - EP[s6]) * u;
          let Y = EP[s6 + 1] + (EP[s6 + 4] - EP[s6 + 1]) * u;
          let Z = EP[s6 + 2] + (EP[s6 + 5] - EP[s6 + 2]) * u;
          // Toward each particle's scatter home as the burst advances.
          X += (p.sx - X) * kk; Y += (p.sy - Y) * kk; Z += (p.sz - Z) * kk;
          const j = 0.008 * Math.sin(t * 1.6 + p.ph);
          X += j; Y += j * 0.7;
          // Once they are free of the arm they wander on their own slow sines,
          // so the field stays alive for as long as "Meet the team" holds.
          const fl = 0.06 * kk;
          X += fl * Math.sin(t * 0.4 + p.ph);
          Y += fl * 0.8 * Math.cos(t * 0.33 + p.ph * 1.3);
          Z += fl * 0.7 * Math.sin(t * 0.27 + p.ph * 0.7);
          const XR = X * cB + Z * sB, ZR = -X * sB + Z * cB;
          const persp = 4.6 / (4.6 + ZR);
          const pxx = cx + XR * persp * S, pyy = cy + bob - Y * persp * S;
          const rad = Math.max(0.9, p.size * persp * S);
          const ang = p.spin + t * p.spd * (0.25 + kk * 2.4);
          const tw = 0.55 + 0.45 * Math.sin(t * 1.1 + p.ph) * 0.5;
          ctx.globalAlpha = Math.max(0, Math.min(1, tw * (0.4 + 0.6 * persp) * ARM_ALPHA * dust));
          ctx.strokeStyle = p.c;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const a = ang + (k * 2 * Math.PI) / 3;
            const qx = pxx + rad * Math.cos(a), qy = pyy + rad * Math.sin(a);
            if (k === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // drifting ambient field
      const dt = Math.min(0.05, lastT ? (t - lastT) : 0.016);
      lastT = t;
      const ambFade = 0.55 + 0.45 * fade;
      const par = (window.scrollY || 0) * 0.00006;
      for (let i = 0; i < amb.length; i++) {
        const a = amb[i];
        a.x += a.vx * dt; a.y += a.vy * dt;
        if (a.x < -0.05) a.x = 1.05; else if (a.x > 1.05) a.x = -0.05;
        if (a.y < -0.05) a.y = 1.05; else if (a.y > 1.05) a.y = -0.05;
        const ax = a.x * box.w;
        const ay = (((a.y - par * a.z) % 1) + 1) % 1 * box.h;
        const rr = a.size;
        const an = a.spin + t * a.spd;
        ctx.globalAlpha = Math.max(0, (0.12 + 0.5 * a.z) * (0.55 + 0.45 * Math.sin(t * 0.9 + a.ph)) * ambFade);
        ctx.strokeStyle = a.c;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let q = 0; q < 3; q++) {
          const aa = an + (q * 2 * Math.PI) / 3;
          const qx = ax + rr * Math.cos(aa), qy = ay + rr * Math.sin(aa);
          if (q === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    // StrictMode double-invokes this effect in dev — tear everything down so
    // the second mount starts from a clean slate.
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [canvasRef, axisRef]);
}
