import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function RetroProjectCarousel({ member, onSelect }) {
  const [active, setActive] = useState(0);
  const dragged = useRef(false);
  const reduced = useReducedMotion();
  const count = member.projects.length;
  const step = direction => setActive(current => (current + direction + count) % count);
  return <div className="retro-project-showcase" role="region" aria-roledescription="carousel" aria-label={`${member.name}'s projects`} tabIndex={0} onKeyDown={event => {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
  }}>
    <div className="retro-coverflow">
      <button className="retro-card-arrow retro-card-previous" aria-label={`Previous project for ${member.name}`} onClick={() => step(-1)}>←</button>
      <button className="retro-card-arrow retro-card-next" aria-label={`Next project for ${member.name}`} onClick={() => step(1)}>→</button>
      {member.projects.map((item, index) => {
        let offset = index - active;
        if (offset > count / 2) offset -= count;
        if (offset < -count / 2) offset += count;
        const front = offset === 0;
        return <motion.div className="retro-project-sheet" data-active={front} key={item.title}
          initial={false} animate={{ x: `${offset * 64}%`, scale: front ? 1 : .82, rotateY: offset * -24 }}
          transition={{ duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] }}
          style={{ zIndex: front ? 3 : 1, touchAction: 'pan-y', '--side-fade': offset < 0 ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,.12) 30%, #000 100%)' : 'linear-gradient(to left, transparent 0%, rgba(0,0,0,.12) 30%, #000 100%)' }}
          drag={front ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={.18}
          onDragStart={() => { dragged.current = true; }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -45 || info.velocity.x < -350) step(1);
            else if (info.offset.x > 45 || info.velocity.x > 350) step(-1);
          }}>
          <button tabIndex={front ? 0 : -1} aria-label={front ? `Read about ${item.title} by ${member.name}` : `Show ${item.title} for ${member.name}`}
            onPointerDown={() => { dragged.current = false; }}
            onClick={() => { if (dragged.current) return; if (front) onSelect({ member, project: item }); else setActive(index); }}>
            <div className="retro-project-photo"><img src={item.photo} alt={item.title} loading="lazy" draggable="false" /></div>
            <div className="retro-project-caption"><span>0{index + 1} / PROJECT</span><h3>{item.title}</h3><p className="retro-card-description">{item.description}</p><span className="retro-project-open" aria-hidden="true">↗</span></div>
          </button>
        </motion.div>;
      })}
    </div>
    <div className="retro-showcase-controls">
      <div className="retro-showcase-dots">{member.projects.map((item, index) => <button key={item.title} aria-label={`Show ${item.title} for ${member.name}`} aria-pressed={index === active} onClick={() => setActive(index)} />)}</div>
      <span>{active + 1} / {count}</span>
    </div>
  </div>;
}
