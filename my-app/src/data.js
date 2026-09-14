export const MEMBERS = [
  { name: "Tian Wen", role: "Hardware — Mechanical", line: "Designs the structure everything else bolts to, from concept to fabricated part.", chips: ["CAD & tolerancing", "Fabrication", "Mechanism design"],
    project: { title: "Modular Gripper Assembly", scope: "End-effector for mixed-part handling", stack: "SolidWorks, 3D print, pneumatics", result: "Replace with a real outcome" } },
  { name: "Jovyan", role: "AI / Software Engineer", line: "Turns models and logic into software that keeps running on the floor.", chips: ["Backend services", "Model deployment", "Data pipelines"],
    project: { title: "Vision-Guided Pick & Place", scope: "Perception service driving a 6-axis arm", stack: "Python, ROS 2, OpenCV", result: "Replace with a real outcome" } },
  { name: "Vincent Santosa", role: "Hardware — Electronics", line: "Power, sensing and control boards, from schematic through bring-up.", chips: ["Schematic & PCB", "Sensors", "Bring-up & test"],
    project: { title: "Motor Drive & Sensor Board", scope: "Custom control board for a conveyor rig", stack: "KiCad, STM32, CAN", result: "Replace with a real outcome" } },
  { name: "Davina Nadine", role: "Business Analyst / Systems Engineer", line: "Translates a plant problem into requirements the team can build against.", chips: ["Requirements", "Process mapping", "Cost & ROI"],
    project: { title: "Line Throughput Study", scope: "Bottleneck analysis and automation case", stack: "Process mapping, discrete-event sim", result: "Replace with a real outcome" } },
  { name: "Cliffton Owen", role: "AI / ML / Software Engineer", line: "Builds the perception and decision models, and the evidence that they work.", chips: ["Computer vision", "Model training", "Evaluation"],
    project: { title: "Defect Detection Model", scope: "Inline visual inspection classifier", stack: "PyTorch, ONNX, edge GPU", result: "Replace with a real outcome" } },
  { name: "Brian Wong", role: "Project Manager, UI/UX", line: "Keeps the schedule honest and the operator interface usable.", chips: ["Delivery", "Interface design", "Stakeholder comms"],
    project: { title: "Operator Console", scope: "HMI for cell status and manual override", stack: "Figma, web HMI, MQTT", result: "Replace with a real outcome" } },
  { name: "Wen Xuan", role: "Hardware — System Integration", line: "Makes the subsystems behave as one machine, safely.", chips: ["Integration", "Commissioning", "Safety & interlocks"],
    project: { title: "Cell Integration & Commissioning", scope: "Bringing arm, vision and conveyor under one controller", stack: "PLC, Modbus TCP, safety relays", result: "Replace with a real outcome" } }
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

export const PARTICLE_COLORS = ["#8052ff", "#ffb829", "#15846e", "#b39dff", "#4a6cf7", "#d75ec9", "#5ad1c8"];

export const pad = (i) => String(i + 1).padStart(2, "0");

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
