// Each project: { title, photo, description, details?, link? }. `description` is
// the one-line summary under the carousel; `details` is the long-form write-up
// shown only in the detail sheet — a string, or an array of strings for
// paragraphs. `link`, when present, is shown under the write-up.
export const MEMBERS = [
  { name: "Tian Wen", photo: "/pic/Tian%20Wen.png", role: "Hardware — Mechanical", major: "EPD", overviewRole: "Hardware (Mechanical)", line: "Designs the structure everything else bolts to, from concept to fabricated part.", chips: ["CAD & tolerancing", "Fabrication", "Mechanism design"],
    stack: ["SolidWorks", "3D print", "Pneumatics"],
    projects: [
      { title: "Modular Gripper Assembly", photo: "", description: "End-effector for mixed-part handling. Replace with a real outcome.",
        details: [
          "Replace with the full write-up: what the problem was, what was designed and built, and what it achieved on the floor.",
          "A second paragraph is optional — drop `details` entirely and the sheet shows the one-line description on its own.",
        ] },
      { title: "Conveyor Guarding Frame", photo: "", description: "Aluminium-extrusion safety enclosure around the cell. Replace with a real outcome." },
      { title: "Quick-Change Tool Plate", photo: "", description: "Tool-less swap between gripper heads. Replace with a real outcome." },
    ] },
  { name: "Jovyan", photo: "/pic/Jovyan.jpeg", role: "AI / Software Engineer", major: "CSD", overviewRole: "AI/Software Engineer", line: "Turns models and logic into software that keeps running on the floor.", chips: ["Backend services", "Model deployment", "Data pipelines"],
    stack: ["Python", "ROS 2", "OpenCV"],
    projects: [
      { title: "Vision-Guided Pick & Place", photo: "", description: "Perception service driving a 6-axis arm. Replace with a real outcome." },
      { title: "Cell Telemetry Dashboard", photo: "", description: "Live cycle-time and fault data from the line. Replace with a real outcome." },
      { title: "Model Deployment Pipeline", photo: "", description: "One-command rollout of vision models to the edge. Replace with a real outcome." },
    ] },
  { name: "Vincent Santosa", photo: "/pic/Vincent%20Santosa.jpg", role: "Hardware — Electronics", major: "EPD", overviewRole: "Hardware (Electronics)", line: "Power, sensing and control boards, from schematic through bring-up.", chips: ["Schematic & PCB", "Sensors", "Bring-up & test"],
    stack: ["KiCad", "STM32", "CAN"],
    projects: [
      { title: "Motor Drive & Sensor Board", photo: "", description: "Custom control board for a conveyor rig. Replace with a real outcome." },
      { title: "Power Distribution Board", photo: "", description: "24 V distribution with fused channels for the cell. Replace with a real outcome." },
      { title: "Sensor Breakout Module", photo: "", description: "Plug-in board for proximity and load-cell sensors. Replace with a real outcome." },
    ] },
  { name: "Davina Nadine", photo: "/pic/Davina%20Nadine.jpeg", role: "Business Analyst / Systems Engineer", major: "ESD", overviewRole: "Business Analyst, System Engineer", line: "Translates a plant problem into requirements the team can build against.", chips: ["Requirements", "Process mapping", "Cost & ROI"],
    stack: ["Process mapping", "Discrete-event sim"],
    projects: [
      { title: "Line Throughput Study", photo: "", description: "Bottleneck analysis and automation case. Replace with a real outcome." },
      { title: "Automation ROI Model", photo: "", description: "Cost and payback case for the proposed cell. Replace with a real outcome." },
      { title: "Requirements Specification", photo: "", description: "Traceable requirements from plant visit to test plan. Replace with a real outcome." },
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
  { name: "Brian Wong", photo: "/pic/Brian.jpg", role: "Project Manager, UI/UX", major: "CSD", overviewRole: "Product Manager, AI Engineer, UI/UX", line: "Keeps the schedule honest and the operator interface usable.", chips: ["Delivery", "Interface design", "Stakeholder comms"],
    stack: ["Figma", "Web HMI", "MQTT"],
    projects: [
      { title: "Operator Console", photo: "", description: "HMI for cell status and manual override. Replace with a real outcome." },
      { title: "Project Delivery Plan", photo: "", description: "Milestones, risks and sprint cadence for the build. Replace with a real outcome." },
      { title: "Operator Usability Study", photo: "", description: "Walkthrough testing of the HMI with plant operators. Replace with a real outcome." },
    ] },
  { name: "Wen Xuan", photo: "/pic/WenXuan.jpg", role: "Hardware — System Integration", major: "EPD", overviewRole: "Hardware (System Integration)", line: "Makes the subsystems behave as one machine, safely.", chips: ["Integration", "Commissioning", "Safety & interlocks"],
    stack: ["PLC", "Modbus TCP", "Safety relays"],
    projects: [
      { title: "Cell Integration & Commissioning", photo: "", description: "Bringing arm, vision and conveyor under one controller. Replace with a real outcome." },
      { title: "Safety Interlock Circuit", photo: "", description: "E-stop and door-switch chain for the robot cell. Replace with a real outcome." },
      { title: "Factory Acceptance Test", photo: "", description: "Test procedure and sign-off pack for handover. Replace with a real outcome." },
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
