import { useEffect, useRef, useState } from 'react';

const COLORS = ['#f0ad1d', '#ed694b', '#3d8ed2', '#9364bf', '#289b7b', '#d85c99', '#83a334'];
const seed = (x, y = 0) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;

function useMotionPreference() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function makeSculptures(compact, field = false) {
  const centers = field
    ? (compact ? [[35,60],[565,120],[500,335],[110,610],[425,690],[80,760],[590,825]] : [[65,100],[830,65],[1320,220],[570,470],[1050,505],[100,650],[1360,670]])
    : compact
      ? [[85,95],[230,125],[390,95],[540,125],[125,325],[310,340],[505,325]]
      : [[55,170],[265,145],[475,190],[700,145],[920,180],[1135,140],[1360,185]];
  const particles = [];
  centers.forEach(([cx,cy], group) => {
    for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) {
      const distance = Math.hypot(x,y), radius = Math.max(Math.abs(x),Math.abs(y));
      const angle = Math.atan2(y,x), random = seed(x+group*20,y);
      const include = [
        distance > 3.5 && distance < 5.8,
        radius < 5.2 && (Math.abs(x)<1.7 || Math.abs(y)<1.7),
        Math.abs(x)+Math.abs(y)<7.2 && Math.abs(x)+Math.abs(y)>2.1,
        distance < 4.5+1.2*Math.cos(angle*5),
        distance < 5.5 && random>.09,
        radius<5.5 && (Math.floor((x+6)/3)+Math.floor((y+6)/3))%2===0,
        radius<5.5 && radius>3.3,
      ][group];
      if (include) particles.push({x:x*10,y:y*10,cx,cy,group,random,color:COLORS[group]});
    }
  });
  return particles;
}

export function RetroPixels({ variant = 'sculptures' }) {
  const ref = useRef(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    const canvas = ref.current, context = canvas.getContext('2d');
    let width=0,height=0,logicalWidth=1400,logicalHeight=340,particles=[],frame=0,lastFrame=0,visible=false;
    const pointer={x:-1000,y:-1000};
    const draw = time => {
      if (!reduced && visible && !document.hidden) frame=requestAnimationFrame(draw);
      if (!reduced && time-lastFrame<33) return;
      lastFrame=time;
      const t=reduced?0:time/1000;
      context.clearRect(0,0,width,height);
      const scale=width/logicalWidth, vertical=height/logicalHeight;
      if(variant==='sculptures'||variant==='hero-field') {
        for(const particle of particles) {
          const {x,y,cx,cy,group,random}=particle;
          const speed=[.18,-.22,.13,-.16,.2,-.12,.16][group];
          const angle=t*speed;
          let px=x,py=y;
          if(group===0||group===2||group===3||group===6) {
            px=x*Math.cos(angle)-y*Math.sin(angle);py=x*Math.sin(angle)+y*Math.cos(angle);
          }
          if(group===1) {px+=Math.sin(t*.75+y/35)*9;py+=Math.cos(t*.6+x/40)*6;}
          if(group===4) {const breath=1+.08*Math.sin(t*.8);px*=breath;py*=breath;}
          if(group===5) {px+=Math.sin(t*.8+y/14)*7;}
          px=(cx+px+Math.sin(t*.35+group)*9)*scale;
          py=(cy+py+Math.cos(t*.5+group*.8)*12)*vertical;
          const dx=px-pointer.x,dy=py-pointer.y,reach=Math.hypot(dx,dy);
          if(!reduced&&reach<100) {px+=dx*(1-reach/100)*.45;py+=dy*(1-reach/100)*.45;}
          context.fillStyle=particle.color;context.globalAlpha=random>.84?.55:1;
          const size=Math.max(3,8*scale);
          context.fillRect(px,py,size,size);
          if(random>.92){context.fillStyle='#31466c';context.globalAlpha=.12;context.fillRect(px+size*.6,py+size*.8,size,size);}
        }
      } else {
        const columns=Math.ceil(width/9), rows=variant==='constellation'?25:17;
        for(let x=0;x<columns;x++)for(let y=0;y<rows;y++){
          const nx=x/columns, random=seed(x,y);
          const wave=variant==='constellation'
            ? rows/2+Math.sin(nx*13-t*.35)*4+Math.cos(nx*6+t*.3)*2
            : rows/2+Math.sin(nx*10-t*.65)*3.4;
          const distance=Math.abs(y-wave);
          if(distance>4.8||random<.15||(distance>2.8&&random>.48))continue;
          let px=x*9,py=y*height/rows;
          if(variant==='constellation') {px+=Math.sin(t*.4+y*.6)*5;py+=Math.cos(t*.5+x*.1)*5;}
          else py+=Math.sin(t*.8+x*.12)*3;
          context.fillStyle=COLORS[(Math.floor(random*7)+Math.floor(x/30))%7];
          context.globalAlpha=distance>3.5?.45:.9;
          context.fillRect(px,py,6,6);
        }
      }
      context.globalAlpha=1;
    };
    const resize = () => {
      const bounds=canvas.getBoundingClientRect();width=bounds.width;height=bounds.height;
      logicalWidth=width<700?620:1400;
      logicalHeight=variant==='hero-field'?(width<700?870:780):(width<700?450:340);
      particles=makeSculptures(width<700,variant==='hero-field');
      const ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);
      if(reduced){draw(0);}
    };
    const restart=()=>{cancelAnimationFrame(frame);lastFrame=0;if(reduced)draw(0);else if(visible&&!document.hidden)frame=requestAnimationFrame(draw);};
    const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();},{rootMargin:'80px'});
    const observer=new ResizeObserver(()=>{resize();restart();});observer.observe(canvas);intersection.observe(canvas);resize();
    const move=event=>{const rect=canvas.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;};
    const leave=()=>{pointer.x=-1000;pointer.y=-1000;};
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',restart);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',restart);};
  },[reduced,variant]);
  return <canvas ref={ref} className={`retro-pixels retro-pixels-${variant}`} aria-hidden="true" />;
}

export function PixelGlyph({ index = 0 }) {
  const shape = [
    <path d="M12 0h12v12h12v12H24v12H12V24H0V12h12Z" />,
    <path fillRule="evenodd" d="M6 0h24v6h6v24h-6v6H6v-6H0V6h6Zm6 12v12h12V12Z" />,
    <path d="m18 0 6 6v6h6l6 6-6 6h-6v6l-6 6-6-6v-6H6l-6-6 6-6h6V6Z" />,
    <path d="M0 0h12v12H0Zm24 0h12v12H24ZM12 12h12v12H12ZM0 24h12v12H0Zm24 0h12v12H24Z" />,
  ][index%4];
  return <svg viewBox="0 0 36 36" className={`pixel-glyph pixel-glyph-${index%4}`} aria-hidden="true">{shape}</svg>;
}

const SCULPTURE_PARTICLES = makeSculptures(false);

export function PixelSculpture({ kind = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(entries => {
      node.style.setProperty('--sculpture-play-state', entries[0].isIntersecting ? 'running' : 'paused');
    }, { rootMargin: '60px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className={`retro-decoration sculpture-${kind} ${className}`} aria-hidden="true"><svg width="180" height="180" viewBox="-85 -85 170 170"><g className="sculpture-particles">{SCULPTURE_PARTICLES.filter(particle => particle.group === kind).map((particle,index) => <rect key={index} x={particle.x-4} y={particle.y-4} width="8" height="8" fill={COLORS[kind]} opacity={particle.random > .84 ? .6 : 1} />)}</g></svg></span>;
}

// Each occupied cell is a square pixel, keeping the pictograms in the retro palette.
const CARD_ICONS = {
  scope: [
    '..########..', '..########..', '..##....##..', '..##.##.##..', '..##....##..',
    '..##.##.##..', '..##....##..', '..##.##.##..', '..##....##..', '..########..',
    '..########..', '............',
  ],
  approval: [
    '............', '............', '.........##.', '........###.', '.......###..',
    '..##..###...', '..######....', '...####.....', '....##......', '............',
    '............', '............',
  ],
  delivery: [
    '.....##.....', '....####....', '...######...', '.....##.....', '.....##.....',
    '.##..##..##.', '.##......##.', '.##......##.', '.##########.', '.##########.',
    '............', '............',
  ],
  team: [
    '............', '............', '............', '##..###...##', '###.####.###',
    '############', '###.########', '##...######.', '......####..', '.......##...',
    '............', '............',
  ],
  idea: [
    '.....##.....', '..#......#..', '....####....', '...######...', '..##....##..',
    '..##....##..', '...##..##...', '....####....', '....####....', '............',
    '....####....', '.....##.....',
  ],
  hammer: [
    '............', '...######...', '..########..', '..#########.', '...######.#.',
    '.....##.....', '.....##.....', '.....##.....', '.....##.....', '.....##.....',
    '....####....', '....####....',
  ],
};

function iconPart(icon, x, y) {
  if (icon === 'team') return x < 3 ? 'handshake-left-sleeve' : x > 8 ? 'handshake-right-sleeve' : 'handshake-grip';
  if (icon === 'scope' && x > 3 && x < 8 && [3, 5, 7].includes(y)) return `document-line-${y}`;
  if (icon === 'approval') return `check-step-${x}`;
  if (icon === 'delivery' && y < 6 && x >= 3 && x <= 8) return 'delivery-arrow';
  if (icon === 'idea') return y < 2 ? 'bulb-rays' : y < 9 ? 'bulb-glass' : 'base';
  return 'base';
}

export function PixelCardIcon({ icon }) {
  if (icon === 'team') return <span className="pixel-card-icon pixel-card-icon-team" aria-hidden="true">
    <svg viewBox="0 0 120 120"><g className="pixel-icon-body handshake-drawing">
      <path fill="#dfa260" d="M22 43h15V33h17v7h13l10 10h13v29H77v11H64v7H52v-7H42V79H31V66h-9Z" />
      <path fill="#f3c78d" d="M94 40H79V30H62v7H51L36 52v10h13l14-13h8l18 18h8Z" />
      <path fill="none" stroke="#80552f" strokeWidth="5" strokeLinejoin="miter" d="M36 52v10h13l14-13h8l24 24M76 67l10 10v9H76L64 74m10 12v10H63L51 84m11 10v9H51L33 85V73" />
      <path fill="#3d8ed2" d="M2 31h14v8h12v34H16v9H2Z" />
      <path fill="#289b7b" d="M118 28h-14v8H92v34h12v9h14Z" />
      <path fill="#d9edf7" d="M16 43h7v24h-7Z" />
      <path fill="#d9eee6" d="M97 40h7v24h-7Z" />
    </g></svg>
  </span>;
  const parts = {};
  CARD_ICONS[icon].forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell !== '#') return;
    const part = iconPart(icon, x, y);
    (parts[part] ??= []).push(<rect key={`${x}-${y}`} x={x * 10} y={y * 10} width="9" height="9" />);
  }));
  return <span className={`pixel-card-icon pixel-card-icon-${icon}`} aria-hidden="true">
    <svg viewBox="0 0 120 120"><g className="pixel-icon-body">{Object.entries(parts).map(([part, pixels]) =>
      <g key={part} className={`icon-part ${part}`} style={{ '--pixel-delay': `${Number(part.split('-').at(-1)) * 55 || 0}ms` }}>{pixels}</g>
    )}</g></svg>
  </span>;
}
