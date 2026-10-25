import { useEffect, useRef } from 'react';

export function PastelStudioMotion() {
  const ref=useRef(null);
  useEffect(()=>{
    const hero=ref.current.closest('.pastel-studio-hero');
    const image=hero.querySelector('.studio-hero-art');
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    const move=event=>{if(media.matches||frame)return;frame=requestAnimationFrame(()=>{frame=0;const r=hero.getBoundingClientRect();image.style.setProperty('--studio-x',`${(event.clientX/r.width-.5)*-9}px`);image.style.setProperty('--studio-y',`${((event.clientY-r.top)/r.height-.5)*-5}px`);});};
    const reset=()=>{image.style.setProperty('--studio-x','0px');image.style.setProperty('--studio-y','0px');};
    hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',reset);
    return()=>{cancelAnimationFrame(frame);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);};
  },[]);
  return <div className="pastel-studio-motion" ref={ref} aria-hidden="true"><svg className="studio-breeze" viewBox="0 0 1440 650" preserveAspectRatio="none"><path className="breeze-line breeze-a" d="M-50 350C200 245 290 400 470 370S800 185 990 325 1300 400 1490 230" /><path className="breeze-line breeze-b" d="M-50 380C210 285 300 430 490 400S810 220 1000 350 1300 420 1490 270" /></svg></div>;
}
