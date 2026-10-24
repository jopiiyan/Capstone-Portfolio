// Each project: { title, photo, description, details?, link? }. `description` is
// the one-line summary under the carousel; `details` is the long-form write-up
// shown only in the detail sheet — a string, or an array of strings for
// paragraphs. `link`, when present, is shown under the write-up.
export const MEMBERS = [
  { name: "Tian Wen", photo: "/pic/Tian%20Wen.png", role: "Hardware (Mechanical)", major: "EPD", overviewRole: "Hardware (Mechanical)", line: "Mechanical Intern at Dematic", chips: ["2D Drafting", "3D Modelling", "Fabrication"],
    stack: ["AutoCAD", "Fusion 360", "3D Printing", "Laser Cutting"],
    projects: [
      { title: "EMBO", photo: "/pic/projects/tianwen-embo.jpg", description: "The internal support structure for an automated embolic-agent mixing and particle-sizing device.",
        details: "Designed and built the complete internal support structure for an automated embolic-agent mixing and particle-sizing device, which won Best Prototype and Crowd Favourite at the SUTD 30.007 Engineering Design Innovation Exhibition." },
      { title: "REFLEX (AI) Smart Mirror", photo: "/pic/projects/tianwen-reflex.jpg", description: "A full-scale standing enclosure for an AI-powered smart mirror at SUTD's fabrication lab.",
        details: "Developed a full-scale standing enclosure for an AI-powered smart mirror deployed at SUTD's fabrication lab, serving as a real-time safety checkpoint that detects improper workshop attire, identifies missing safety requirements, and provides voice-activated guidance without immediate staff assistance." },
      { title: "Orthomate", photo: "/pic/projects/tianwen-orthomate.jpg", description: "The electronics housing for a closed-loop, self-adjusting orthopedic insole.",
        details: "Customised the electronics housing for a closed-loop, self-adjusting orthopedic insole, which won the Breakthrough Innovation Award for Top Course Project at SUTD's EPD 3D Design Exhibition." },
    ] },
  { name: "Jovyan", photo: "/pic/Jovyan.jpeg", role: "AI/Software Engineer", major: "CSD", overviewRole: "AI/Software Engineer", line: "Incoming AI Software Development Intern at Panasonic R&D Centre Singapore", chips: ["AI/Software Engineering", "Fine-Tuning LLMs", "Advanced RAG"],
    stack: ["React Native", "Express.js", "ESP32", "Java"],
    projects: [
      { title: "Leafmebe", photo: "/pic/projects/jovyan-leafmebe.jpg", description: "An IoT atmospheric water-harvesting system that won SGD 2,000 in SUTD funding.",
        details: "Built the full-stack app (React Native, Express.js, MySQL) and programmed an ESP32 to harvest water from ambient humidity and run the water dispensing mechanism, letting users water their plants efficiently." },
      { title: "Virtual Paddock Engineer", photo: "/pic/projects/jovyan-virtual-paddock.jpg", description: "The evaluation harness for an F1 analytics dashboard.",
        details: "Built the evaluation harness for Virtual Paddock Engineer, an F1 analytics dashboard, ablating 9 retrieval configurations against a 40-question hand-labelled golden set and finding that only hybrid search beat baseline on that corpus." },
      { title: "FoodTok", photo: "/pic/projects/jovyan-foodtok.jpg", description: "A full-stack native Android app in Java for short-form recipe video discovery.",
        details: "Built a full-stack native Android application in Java for short-form recipe video discovery, featuring a personalised infinite-scroll feed, recipe uploads, social interactions (likes, saves, follows, comments), Trie-powered ingredient search, and AI-assisted recipe enrichment." },
    ] },
  { name: "Vincent Santosa", photo: "/pic/Vincent%20Santosa.jpg", role: "Hardware (Electronics)", major: "EPD", overviewRole: "Hardware (Electronics)", line: "Electronics Intern at Fugro Subsea Technology", chips: ["PCB Design", "Mechatronic Prototyping", "3D Modelling & Graphics"],
    stack: ["Altium", "KiCad", "SolidWorks", "Blender"],
    projects: [
      { title: "Electronics Intern, Fugro Subsea Technology", photo: "/pic/projects/vincent-fugro.jpg", description: "PCB and electronic system design for work-class and observation-class ROVs.",
        details: "Analog and digital PCB design, and electronic system design, analysis and testing for a 200HP hydraulic work-class ROV (FCV3000) and observation-class electric ROVs (Blue Amp, Blue Volta)." },
      { title: "EMBO (Electronics)", photo: "/pic/projects/vincent-embo.jpg", description: "A custom 4-layer controller board for an automated medical embolic-agent device.",
        details: "Designed and built the full custom controller (4-layer PCB) for an automated medical embolic-agent mixing, viscosity measurement and particle-sizing device, which won Best Prototype and Crowd Favourite at the SUTD 30.007 Engineering Design Innovation Exhibition." },
      { title: "SwimBladder", photo: "/pic/projects/vincent-swimbladder.jpg", description: "A power distribution board for an 8-thruster underwater vehicle, rated for 100A.",
        details: "Designed an 8-thruster underwater vehicle power distribution board rated for 100A system current across 8× Blue Robotics T200 thrusters, under the SUTD Organisation of Autonomous Robotics' Underwater Unit." },
    ] },
  { name: "Davina Nadine", photo: "/pic/Davina%20Nadine.jpeg", role: "Business Analyst, Systems Engineer", major: "ESD", overviewRole: "Business Analyst, Systems Engineer", line: "Business Analyst Intern at Accenture", chips: ["Business Analysis", "Data Analytics", "Optimisation"],
    stack: ["SQL", "Python", "Power BI"],
    projects: [
      { title: "SwipeRx: Data Analytics for E-Commerce", photo: "/pic/projects/davina-swiperx.jpg", description: "Demand analysis of ~8M B2B transactions for a new pharmacy launch in East Jakarta.",
        details: "Analysed ~8M B2B transactions using SQL, Python, and Power BI to identify demand trends, achieve 99.7% forecast accuracy, and develop a budget-constrained inventory plan covering 98.2% of active subcategories for a new pharmacy launch in East Jakarta." },
      { title: "VRP with Time Windows for Singapore MRT", photo: "/pic/projects/davina-mrt-vrp.jpg", description: "A MILP vehicle routing model covering all 173 MRT stations.",
        details: "Developed a MILP vehicle routing model in Python for 173 MRT stations, achieving 100% station coverage while minimising travel distance and satisfying capacity and time-window constraints." },
      { title: "Changi Airport T3 Gate Assignment Optimisation", photo: "/pic/projects/davina-changi-gates.jpg", description: "Metaheuristic gate assignment for 100+ daily flights across 31 gates.",
        details: "Developed and benchmarked metaheuristic optimisation models in Python for 100+ daily flights across 31 gates, reducing the overall objective by 26.33% while improving gate utilisation, passenger walking distance, and operational feasibility." },
    ] },
  { name: "Cliffton Owen Gunawan", photo: "/pic/Cliffton.jpg", website: "https://clifftonowen.me/", role: "AI/ML, Software Engineer", major: "CSD", overviewRole: "AI/ML, Software Engineer", line: "Incoming Data Scientist and Automation Intern at Infineon", chips: ["Machine Learning", "Full-Stack Development", "Data Engineering"],
    stack: ["PyTorch", "HuggingFace", "FastAPI", "pgvector"],
    projects: [
      { title: "ML R&D Intern, Bosch Group (SEA)", photo: "/pic/projects/cliffton-bosch.jpg", description: "Time-series Transformers that predict food weight from oven sensors, reaching R² = 0.982.",
        details: [
          "Trained PatchTST time-series Transformers predicting food weight from fused oven sensor streams (cavity temperature, lambda O₂, PID), reaching R² = 0.982 and 40.44 g mean absolute error across 125 samples.",
          "Built a data pipeline over 441 sensor-log files and used linear baselines to show a linear model could not fit the problem, which justified the move to deep learning. Presented the findings to stakeholders.",
        ],
        link: "https://clifftonowen.me/" },
      { title: "Markpoint", photo: "/pic/projects/cliffton-markpoint.jpg", description: "A solo AI platform that finds every past paper a question has appeared in, then marks answers one mark point at a time.",
        details: [
          "Developed and deployed a solo AI platform indexing 30,176 mark points from 315 exam papers, using hybrid PostgreSQL and pgvector retrieval with LLM-based marking.",
          "Built with FastAPI, PostgreSQL 17, pgvector, React 19 and Docker.",
        ],
        link: "https://markpoint.app/" },
      { title: "Multi-Agent Educational Content Generation", photo: "/pic/projects/cliffton-multi-agent.jpg", description: "A multi-agent pipeline that turns a topic into notes, flashcards, a narrated video and PDFs.",
        details: [
          "Self-initiated as a UROP. Implemented ThreadPoolExecutor and Vertex AI ADK behind one interface to compare concurrency models, with a FastAPI backend and 298 automated tests.",
          "The front end is deployed. Backend hosting is still in progress.",
        ],
        link: "https://parallel-ai-agents.vercel.app/" },
    ] },
  { name: "Brian Wong", photo: "/pic/Brian.jpg", role: "AI Engineer", major: "CSD", overviewRole: "AI Engineer", line: "Incoming AI Engineer Intern at Infineon", chips: ["UI/UX", "AI/Machine Learning", "Project Management"],
    stack: ["Whisper", "GPT", "Raspberry Pi"],
    projects: [
      { title: "notebud", photo: "/pic/projects/brian-notebud.jpg", description: "An AI note-taking system on a Raspberry Pi that won Best Project in a cohort of about 50.",
        details: "An AI note-taking system that runs Whisper and GPT transcription with a web assistant grounded in live lecture context, ran on a Raspberry Pi at under $100 per unit and won Best Project in a cohort of about 50." },
      { title: "Fames.com", photo: "/pic/projects/brian-fames.jpg", description: "A web platform where developers advertise their games and gamers discover hidden gems.",
        details: "A web platform where developers can advertise their games and gamers can discover “hidden gems” that never got a marketing budget.",
        link: "https://www.fames.site/" },
      { title: "DAS D.I.A.L", photo: "/pic/projects/brian-das-dial.jpg", description: "A web application built with the Dyslexia Association of Singapore.",
        details: "Web application built in collaboration with the Dyslexia Association of Singapore, with 3 core features: Screening, Worksheet Generation, and Parent Insight Dashboard." },
    ] },
  { name: "Wen Xuan", photo: "/pic/WenXuan.jpg", role: "Hardware (System Integration)", major: "EPD", overviewRole: "Hardware (System Integration)", line: "Incoming Mechanical Engineering Intern at Pyxis Maritime", chips: ["PCB Design", "CAD Modelling", "Fabrication"],
    stack: ["Eagle", "AutoCAD", "Fusion 360", "SolidWorks"],
    projects: [
      { title: "Vantage", photo: "/pic/projects/wenxuan-vantage.jpg", description: "The frame housing every subsystem of a rapid elevated surveillance device.",
        details: "Designed and built the frame to house all subsystems for a rapid elevated surveillance device, which won Best Prototype and Crowd Favourite at the SUTD 30.007 Engineering Design Innovation Exhibition." },
      { title: "SUTD Competitive Robotics Team (SCRT)", photo: "/pic/projects/wenxuan-scrt.jpg", description: "Led a team of 13 in the VEX U Robotics Competition 2025-2026 season.",
        details: "Led a team of 13 in the VEX U Robotics Competition 2025-2026 Season: Push Back, achieving the Amaze Award and Tournament Semi-Finalist at the VEX Asia Open Signature Event 2025." },
      { title: "Hané Board", photo: "/pic/projects/wenxuan-hane-board.jpg", description: "A physical jigsaw task board for workers with intellectual differences.",
        details: "Built a physical jigsaw task board that dispatches and tracks workplace tasks for workers with intellectual differences, reducing supervisory burden while developing their independence." },
    ] }
];

export const CAPABILITIES = [
  { title: "Automation feasibility", body: "We walk the process, map the steps, and say plainly what is worth automating and what is not." },
  { title: "Mechanical design & build", body: "Fixtures, frames, end-effectors and mechanisms — designed, tolerance-checked and fabricated." },
  { title: "Control electronics", body: "Sensing, drives and custom boards, specified or designed from scratch and bench-verified." },
  { title: "Machine vision & ML", body: "Inspection, detection and guidance models trained on your parts, with measured accuracy." },
  { title: "Software & integration", body: "The layer that ties PLC, robot, vision and data together, plus the operator interface." },
  { title: "Commissioning & handover", body: "On-site bring-up, safety checks, documentation and training so it runs without us." }
];

export const STACK = [
  { group: "Mechanical", items: ["SolidWorks", "Fusion 360", "FDM / SLA printing", "CNC & sheet metal"] },
  { group: "Electronics", items: ["KiCad", "STM32 / ESP32", "Sensor selection", "Bench validation"] },
  { group: "Software & AI", items: ["Python", "PyTorch", "OpenCV", "ROS 2"] },
  { group: "Controls", items: ["PLC ladder / ST", "Modbus TCP", "MQTT", "Industrial networking"] },
  { group: "Delivery", items: ["Requirements docs", "Figma", "Jira", "Test & handover packs"] }
];

export const PARTICLE_COLORS = ["#9DBBA2", "#9DBBA2", "#C4D6C3", "#5F7F66", "#A3A69C", "#EFEADF", "#F2B705"];

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
