import { MEMBERS } from './content.js';
import { PastelStudioMotion } from './PastelMotion.jsx';
import './pastel-refresh.css';

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function PastelHero() {
  return <section className="pastel-studio-hero" id="home">
    <img className="studio-hero-art" src="/art/hepta-pastel-studio.png" alt="" fetchPriority="high" />
    <div className="studio-hero-copy"><span className="studio-programme"><span /> SUTD industry Capstone</span><h1>A development team<br />for your next idea</h1><p>Hepta brings together seven SUTD students in hardware, software and systems engineering for eight months of applied R&amp;D.</p><div className="studio-actions"><a className="primary-link" href="#partnership">Explore the partnership <Arrow /></a><a className="studio-team-link" href="#why-hepta"><span className="studio-avatars" aria-hidden="true">{[MEMBERS[5],MEMBERS[4],MEMBERS[3]].map(member=><img key={member.name} src={member.photo} alt="" />)}</span><span>Meet Hepta</span><Arrow /></a></div></div>
    <PastelStudioMotion /><div className="studio-hero-caption"><span>Hardware, software and systems engineering</span><img src="/pic/SUTDLogo_Dark@2x.webp" alt="Singapore University of Technology and Design" /></div>
  </section>;
}

export function PastelToolArt({ index }) {
  const images = [
    <g><rect x="7" y="10" width="66" height="45" rx="7" fill="#e8eef9" /><path d="M7 22h66" /><circle cx="15" cy="16" r="1" /><circle cx="21" cy="16" r="1" /><path d="m30 32-8 7 8 7m20-14 8 7-8 7m-9-17-5 19" /></g>,
    <g><path d="M20 19h40v35H20Z" fill="#ece6f5" /><path d="M29 12v7m11-7v7m11-7v7M29 54v7m11-7v7m11-7v7M13 28h7m-7 9h7m-7 9h7m40-18h7m-7 9h7m-7 9h7" /><path d="m30 43 9-13 11 13M34 39h11" /></g>,
    <g><rect x="8" y="12" width="64" height="45" rx="5" fill="#dcebdc" /><rect x="30" y="25" width="20" height="18" rx="2" /><path d="M30 31H17V20m13 17H20v13m30-19h13V21m-13 16h12v13" /><circle cx="17" cy="18" r="2" /><circle cx="20" cy="52" r="2" /><circle cx="63" cy="19" r="2" /><circle cx="62" cy="52" r="2" /></g>,
    <g><path d="m40 9 27 15v27L40 66 13 51V24Z" fill="#f7e7bd" /><path d="m13 24 27 15 27-15M40 39v27M27 17l27 15v27" /><path d="M7 60h12m-6-6v12" /></g>,
  ];
  return <svg className="pastel-tool-art" width="80" height="74" viewBox="0 0 80 74" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{images[index]}</svg>;
}

