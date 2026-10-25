import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MEMBERS } from './content.js';
import { PixelCardIcon, PixelGlyph, PixelSculpture, RetroPixels } from './RetroPixels.jsx';
import './design-lab.css';
import { PastelHero, PastelToolArt } from './PastelRefresh.jsx';
import './retro-refresh.css';

const DESIGNS = [
  { id: 'pastel', name: 'Pastel', color: '#b8cde8' },
  { id: 'retro', name: 'Retro', color: '#efbd5b' },
];
const EMAIL = 'capstoneprojectt28@gmail.com';
const EMAIL_LINK = `mailto:${EMAIL}?subject=${encodeURIComponent('Capstone project discussion with Hepta')}`;
const MAJORS = [
  { code: 'CSD', name: 'Computer Science and Design' },
  { code: 'EPD', name: 'Engineering Product Development' },
  { code: 'ESD', name: 'Engineering Systems and Design' },
];
const ROSTER = ['Brian Wong', 'Cliffton Owen Gunawan', 'Davina Nadine', 'Jovyan', 'Tian Wen', 'Vincent Santosa', 'Wen Xuan']
  .map(name => MEMBERS.find(member => member.name === name));
const TOOL_GROUPS = [
  { name: 'Software development', tools: ['React Native', 'Express.js', 'Java', 'FastAPI'] },
  { name: 'AI and data', tools: ['Python', 'PyTorch', 'HuggingFace', 'Whisper', 'GPT', 'pgvector', 'SQL', 'Power BI'] },
  { name: 'Electronics and embedded systems', tools: ['Altium', 'KiCad', 'Eagle', 'ESP32', 'Raspberry Pi'] },
  { name: 'Design and fabrication', tools: ['AutoCAD', 'Fusion 360', 'SolidWorks', 'Blender', '3D Printing', 'Laser Cutting'] },
];

const EXPERTISE = [
  {
    title: 'Hardware development', icon: 2,
    body: 'Mechanical structures, electronics and embedded systems for working prototypes.',
    deliverable: 'Mechanical design, PCB design and integration',
    members: ['Tian Wen', 'Vincent Santosa', 'Wen Xuan'],
    owner: 'Vincent Santosa', project: 'EMBO (Electronics)',
    evidenceTitle: 'EMBO medical device',
    evidenceBody: 'A custom four-layer controller for an automated device that mixes and measures embolic agents.',
  },
  {
    title: 'Software and AI', icon: 0,
    body: 'Applications, machine learning and data pipelines that make information useful to the people working with it.',
    deliverable: 'Application development, AI models and data engineering',
    members: ['Brian Wong', 'Cliffton Owen Gunawan', 'Jovyan'],
    owner: 'Brian Wong', project: 'notebud',
    evidenceTitle: 'notebud',
    evidenceBody: 'Whisper and GPT transcription on a Raspberry Pi, with a web assistant using live lecture context.',
  },
  {
    title: 'Systems and business analysis', icon: 3,
    body: 'Requirements, optimisation and data analysis to guide operational decisions and project planning.',
    deliverable: 'Requirements, analytics and operational planning',
    members: ['Davina Nadine', 'Brian Wong'],
    owner: 'Davina Nadine', project: 'SwipeRx: Data Analytics for E-Commerce',
    evidenceTitle: 'SwipeRx inventory planning',
    evidenceBody: 'Analysis of around eight million B2B transactions to plan inventory for a pharmacy launch in East Jakarta.',
  },
];

function memberAnchor(name) {
  return `member-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function skillTone(skill) {
  if (/management|business|analysis|analytics|optimisation/i.test(skill)) return 'red';
  if (/drafting|modelling|fabrication|pcb|mechatronic/i.test(skill)) return 'orange';
  return 'blue';
}

const TIMELINE = [
  { date: 'Now to Jan 2027', title: 'Find a project partner', body: 'Discuss your company’s needs, possible project areas, and whether our team is a good fit.' },
  { date: 'Feb to Mar 2027', title: 'Agree on the scope', body: 'Define the objectives, requirements, and expected outcomes together.' },
  { date: 'Apr to Jun 2027', title: 'Complete SUTD approval', body: 'Finalise the project details and the required agreements with SUTD.' },
  { date: 'Sep to Dec 2027', title: 'Research and prototype', body: 'Understand the problem, validate requirements, and develop initial concepts and prototypes.' },
  { date: 'Jan to May 2028', title: 'Develop and deliver', body: 'Build, test, and refine the solution before implementation and delivery.' },
];
const REQUIREMENTS = [
  { title: 'Project funding', figure: '$6,000', body: 'The company is expected to provide $6,000 per team for project expenses, including materials, prototyping, and other direct costs during the eight-month project.' },
  { title: 'A company point of contact', body: 'A designated contact who can meet with us regularly and help arrange site visits, stakeholder discussions, or employee interviews when needed.' },
  { title: 'Access to relevant tools', body: 'Access to the commercial software licences and specialised tools we need to work within your company’s environment.' },
];

function initialDesign() {
  return new URLSearchParams(window.location.search).get('design') === 'retro' ? 'retro' : 'pastel';
}

function Arrow({ diagonal = false }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function BrandMark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 4 13 7 3 14-10 11H13L3 25l3-14Z" fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".45" />{[[20,4],[33,11],[36,25],[26,36],[13,36],[3,25],[6,11]].map(([x,y],index)=><circle key={index} cx={x} cy={y} r="2.8" fill="currentColor" />)}</svg>;
}

function DesignSwitcher({ design, onChange }) {
  return <aside className="design-switcher" aria-label="Compare design styles">
    <span className="switcher-caption">Compare styles</span>
    <div className="design-options">{DESIGNS.map(item => <button key={item.id} onClick={() => onChange(item.id)} aria-pressed={design === item.id}><span className="design-swatch" style={{ background: item.color }} />{item.name}</button>)}</div>
    <span className="switcher-note">Hepta / SUTD Capstone</span>
  </aside>;
}

function Navigation() {
  const [active, setActive] = useState('capstone');
  useEffect(() => {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const team = document.getElementById('why-hepta');
      setActive(team && team.getBoundingClientRect().top < innerHeight * .45 ? 'why-hepta' : 'capstone');
    };
    const onScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <header className="demo-nav"><div className="demo-nav-inner">
    <a href="#home" className="demo-brand" aria-label="Hepta home"><BrandMark /><span>Hepta</span></a>
    <nav aria-label="Main navigation"><a href="#capstone" aria-current={active === 'capstone' ? 'location' : undefined}>About Capstone</a><a href="#why-hepta" aria-current={active === 'why-hepta' ? 'location' : undefined}>Why Hepta</a></nav>
    <a className="nav-contact" href="#contact">Contact us <Arrow diagonal /></a>
  </div></header>;
}
function RetroHero() {
  return <section className="retro-hero" id="home">
    <div className="retro-hero-message"><div><span className="hero-programme">Hepta / SUTD industry Capstone</span><h1>Develop your next idea<br />with Hepta</h1></div><div><p>We’re seven SUTD students combining software, hardware and systems engineering. Partner with us for eight months of applied R&D on a challenge your company wants to solve.</p><div className="hero-actions"><a className="primary-link" href="#partnership">Explore the partnership <Arrow /></a><a className="quiet-link" href="#team">See our work</a></div></div></div>
    <RetroPixels /><div className="retro-art-signature"><span>Software, hardware and systems engineering</span><img src="/pic/SUTDLogo_Dark@2x.webp" alt="Singapore University of Technology and Design" /></div>
  </section>;
}

function ToolsStackSection() {
  return <section className="tools-stack-section content-width" id="stack"><div className="section-heading"><div><PixelSculpture kind={2} className="decoration-heading" /><h2 className="section-title">Why Hepta</h2><h3 className="section-description">Our combined tools and stack</h3></div><p>Our members work across software, electronics, mechanical design, and data analysis. These are the tools we use in our individual projects.</p></div><div className="combined-stack">{TOOL_GROUPS.map((group,index)=><article key={group.name}><PixelSculpture kind={(index + 3) % 7} className="decoration-stack" /><span className={`stack-marker stack-marker-${index}`} aria-hidden="true" /><PixelGlyph index={index} /><PastelToolArt index={index} /><h3>{group.name}</h3><div className="stack-tools">{group.tools.map(tool=><span key={tool}>{tool}</span>)}</div></article>)}</div><a className="text-link" href="#team">Meet the team and browse our projects <Arrow /></a></section>;
}

function OfferSummary() {
  return <div className="offer-summary content-width" aria-label="Partnership at a glance"><div><strong>8 months</strong><span>of applied research and development</span></div><div><strong>7 students</strong><span>across three SUTD disciplines</span></div><div><strong>Full IP ownership</strong><span>for the industry partner</span></div></div>;
}

function PartnershipSection() {
  return <section className="partnership-section content-width" id="partnership">
    <div className="section-heading"><div><PixelSculpture kind={0} className="decoration-heading" /><h2 className="section-title">About Capstone</h2><h3 className="section-description">Make progress on a project your company wants to pursue</h3></div><p>Capstone gives your organisation a dedicated student team to investigate a problem, develop a solution, and test it with your requirements in mind.</p></div>
    <div className="partnership-benefits">
      <article><PixelCardIcon icon="team" /><span className="benefit-symbol" aria-hidden="true">⌘</span><h3>A cost-effective project team</h3><p>Capstone offers a lower-cost alternative to an equivalent intern team for a defined development project. Our team brings software, hardware, and business skills, with guidance from SUTD faculty.</p></article>
      <article><PixelCardIcon icon="idea" /><span className="benefit-symbol" aria-hidden="true">↗</span><h3>Capacity to explore an idea</h3><p>Use a scoped Capstone project to investigate an opportunity that time, resources, or other priorities have kept your internal team from pursuing.</p></article>
      <article><PixelCardIcon icon="hammer" /><span className="benefit-symbol" aria-hidden="true">◇</span><h3>Work your company can build on</h3><p>The industry partner retains the intellectual property generated through the project, so your organisation can continue developing, licensing, or commercialising the result.</p></article>
    </div>
    <div className="programme-explainer"><div><h3>What is SUTD Capstone?</h3><p>Capstone is an eight-month, industry-based final-year undergraduate project. Companies propose challenges from their operations or strategic priorities, and students work with them to develop a practical outcome.</p></div><div className="major-list"><span>Our disciplines</span>{MAJORS.map(major => <div key={major.code} data-major={major.code}><strong>{major.code}</strong><span>{major.name}</span></div>)}</div></div>
  </section>;
}

function ExpertiseSection({ onSelect }) {
  return <section className="expertise-section" id="expertise"><div className="content-width"><div className="expertise-intro"><div className="expertise-title-group"><h2 className="section-title">Team expertise</h2><PixelSculpture kind={4} className="decoration-expertise" /></div><h3 className="section-description">What we can take on</h3><p>Our members bring different kinds of project experience. A Capstone scope can combine these areas; the examples below come from our individual work.</p></div><div className="expertise-grid">{EXPERTISE.map(area => {
    const owner = MEMBERS.find(member => member.name === area.owner);
    const project = owner.projects.find(item => item.title === area.project);
    return <article key={area.title}><div className="expertise-domain"><PastelToolArt index={area.icon} /><PixelGlyph index={area.icon} /><h3>{area.title}</h3><p>{area.body}</p><span className="expertise-deliverable">{area.deliverable}</span></div><div className="expertise-evidence"><span className="expertise-evidence-label">Member experience</span><button className="expertise-project" onClick={() => onSelect({ member: owner, project })}><span>{area.evidenceTitle}</span><Arrow diagonal /></button><p>{area.evidenceBody}</p><span className="expertise-evidence-owner">{area.owner}</span></div><div className="expertise-members"><span>Meet the people</span>{area.members.map(name => <a key={name} href={`#${memberAnchor(name)}`}>{name}<Arrow diagonal /></a>)}</div></article>;
  })}</div></div></section>;
}

function MemberCarousel({ member, onSelect }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const count = member.projects.length;
  function goTo(index) {
    const next = (index + count) % count;
    trackRef.current?.scrollTo({ left: next * trackRef.current.clientWidth, behavior: reduced ? 'instant' : 'smooth' });
  }
  return <div className="member-carousel" role="region" aria-roledescription="carousel" aria-label={`${member.name}'s projects`} onKeyDown={event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(active + (event.key === 'ArrowRight' ? 1 : -1)); }
  }}>
    <div className="carousel-track" ref={trackRef} onScroll={event => {
      const track = event.currentTarget;
      setActive(Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / track.clientWidth))));
    }}>
      {member.projects.map((project, index) => <div className="carousel-slide" key={project.title} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} inert={index !== active}>
        <button className="carousel-project" onClick={() => onSelect({ member, project })} aria-label={`Read about ${project.title} by ${member.name}`}>
          <div className="carousel-image"><img src={project.photo} alt={project.title} loading="lazy" /></div>
          <div className="carousel-copy"><span className="carousel-project-number">Project {index + 1} of {count}</span><h3>{project.title}</h3><p>{project.description}</p><span className="carousel-read">View project <Arrow diagonal /></span></div>
        </button>
      </div>)}
    </div>
    <div className="carousel-controls"><span className="carousel-current" aria-live="polite" aria-atomic="true">{active + 1} / {count}</span><div className="carousel-dots">{member.projects.map((project, index) => <button key={project.title} aria-label={`Show ${project.title} for ${member.name}`} aria-pressed={active === index} onClick={() => goTo(index)} />)}</div><div className="carousel-arrows"><button aria-label={`Previous project for ${member.name}`} onClick={() => goTo(active - 1)}><Arrow /></button><button aria-label={`Next project for ${member.name}`} onClick={() => goTo(active + 1)}><Arrow /></button></div></div>
  </div>;
}

function TeamSection({ onSelect }) {
  return <section className="team-section" id="team"><span id="work" className="section-anchor" /><div className="content-width"><div className="section-heading"><div><PixelSculpture kind={5} className="decoration-heading" /><h2 className="section-title">Team and projects</h2><h3 className="section-description">Meet the team and explore our work</h3></div><p>Our experience includes software development, AI, electronics, mechanical design, and business analysis. Browse each person’s projects below.</p></div><div className="team-portfolios">{ROSTER.map((member, index) => <article className="member-portfolio" id={memberAnchor(member.name)} key={member.name}>
    <div className="member-overview"><PixelSculpture kind={index} className="decoration-member" /><button className="demo-member" onClick={() => onSelect({ member })} aria-label={`View ${member.name}'s profile`}><div className="member-portrait"><img src={member.photo} alt={member.name} loading="lazy" /><span className="major-badge" data-major={member.major}>{member.major}</span><span className="member-open"><Arrow diagonal /></span></div><span className="member-name">{member.name}</span><span className="member-role">{member.role}</span></button><p className="member-experience">{member.line}</p><div className="member-skills">{member.chips.map(skill => <span key={skill} data-skill-tone={skillTone(skill)}>{skill}</span>)}</div></div>
    <MemberCarousel member={member} onSelect={onSelect} />
  </article>)}</div></div></section>;
}

function TimelineSection() {
  return <section className="timeline-section content-width" id="timeline"><div className="section-heading"><div><PixelSculpture kind={6} className="decoration-heading" /><h2 className="section-title">Project timeline</h2><h3 className="section-description">How the partnership would take shape</h3></div><p>We’re currently looking for an industry partner. Project development runs from September 2027 to May 2028, following scoping and SUTD approval.</p></div><ol className="project-timeline">{TIMELINE.map((item, index) => <li key={item.title}><div className="timeline-step-icon"><PixelCardIcon icon={['team', 'scope', 'approval', 'hammer', 'delivery'][index]} /><span className="timeline-marker">{index + 1}</span></div><span className="timeline-date">{item.date}</span><h3>{item.title}</h3><p>{item.body}</p>{index < TIMELINE.length - 1 && <span className="timeline-direction" aria-hidden="true"><Arrow /></span>}</li>)}</ol></section>;
}

function RequirementsSection() {
  return <section className="requirements-section content-width" id="requirements"><div className="requirements-intro"><PixelSculpture kind={1} className="decoration-heading" /><h2 className="section-title">Sponsor involvement</h2><h3 className="section-description">What we’d need from your company</h3><p>We’ll manage scheduling, progress tracking, reviews, and deliverables in collaboration with SUTD. The programme asks the company to provide the following.</p></div><div className="requirements-list">{REQUIREMENTS.map(item => <article key={item.title}><div><h3>{item.title}</h3>{item.figure && <span>{item.figure}</span>}</div><p>{item.body}</p></article>)}</div></section>;
}

function ContactSection() {
  return <footer className="contact-section" id="contact"><div className="content-width"><div className="contact-main"><div><PixelSculpture kind={3} className="decoration-contact" /><span className="section-note">Get in touch</span><h2>Have a project in mind?</h2><p>Email us with a short description of the problem or opportunity. We can discuss whether it’s a suitable Capstone project and what working together could involve.</p><a className="primary-link" href={EMAIL_LINK}>Email Hepta <Arrow diagonal /></a><a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a></div><div className="contact-programme"><img src="/pic/SUTDLogo_Dark@2x.webp" alt="Singapore University of Technology and Design" /><span>Industry Capstone programme</span><p>Computer Science and Design<br />Engineering Product Development<br />Engineering Systems and Design</p></div></div><div className="footer-bottom"><a className="footer-brand" href="#home">Hepta</a><span>SUTD student project team</span><a href="#home">Back to top ↑</a></div></div></footer>;
}

function ProjectDescription({ project }) {
  const paragraphs = Array.isArray(project.details) ? project.details : [project.details || project.description];
  return <><img className="detail-project-image" src={project.photo} alt={project.title} /><div className="detail-project-text">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{project.link && <a className="text-link" href={project.link} target="_blank" rel="noreferrer">Visit project website <Arrow diagonal /></a>}</div></>;
}

function DetailDialog({ selection, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (selection) { ref.current?.showModal(); ref.current?.querySelector('.dialog-content')?.scrollTo(0, 0); }
    else ref.current?.close();
  }, [selection]);
  const member = selection?.member;
  const project = selection?.project;
  return <dialog className="detail-dialog" ref={ref} aria-labelledby="detail-title" onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    {member && <><button className="dialog-close" onClick={onClose} aria-label="Close details">×</button><div className="dialog-content">{project ? <><span className="section-note">{member.name} / {member.role}</span><h2 id="detail-title">{project.title}</h2><ProjectDescription project={project} /></> : <><div className="profile-header"><img src={member.photo} alt={member.name} /><div><span className="section-note">{MAJORS.find(major => major.code === member.major)?.name}</span><h2 id="detail-title">{member.name}</h2><p className="profile-role">{member.role}</p><p>{member.line}</p></div></div><div className="profile-skills"><div><h3>Skills</h3><div>{member.chips.map(skill => <span key={skill} data-skill-tone={skillTone(skill)}>{skill}</span>)}</div></div><div><h3>Tools</h3><p>{member.stack.join(', ')}</p></div></div><div className="profile-projects"><h3>Projects and experience</h3>{member.projects.map(item => <details key={item.title}><summary><span><strong>{item.title}</strong><span>{item.description}</span></span><span className="expand-project" aria-hidden="true">+</span></summary><ProjectDescription project={item} /></details>)}</div>{member.website && <a className="text-link" href={member.website} target="_blank" rel="noreferrer">Personal portfolio <Arrow diagonal /></a>}</>}</div></>}
  </dialog>;
}

export default function DesignLab() {
  const [design, setDesign] = useState(initialDesign);
  const [selection, setSelection] = useState(null);
  const closeDialog = () => setSelection(null);
  function changeDesign(id) {
    setDesign(id); setSelection(null);
    const url = new URL(window.location.href);
    url.searchParams.set('design', id); url.hash = '';
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  useEffect(() => {
    const onPopState = () => { setDesign(initialDesign()); setSelection(null); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    document.title = 'Hepta | SUTD Capstone team';
    document.documentElement.dataset.demo = design;
    return () => { delete document.documentElement.dataset.demo; };
  }, [design]);
  return <><DesignSwitcher design={design} onChange={changeDesign} /><div className={`demo-site ${design}`} key={design}><a className="demo-skip" href="#capstone">Skip to content</a><Navigation /><main>{design === 'pastel' ? <PastelHero /> : <RetroHero />}<OfferSummary /><div id="capstone" className="programme-content"><PartnershipSection /><TimelineSection /><RequirementsSection /></div><div id="why-hepta" className="team-content"><ToolsStackSection /><ExpertiseSection onSelect={setSelection} /><TeamSection onSelect={setSelection} /></div></main><ContactSection /><DetailDialog selection={selection} onClose={closeDialog} /></div></>;
}
