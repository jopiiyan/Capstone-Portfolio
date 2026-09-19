// Tab 1 copy. Every string here is transcribed verbatim from revise.md, which
// carries it over from the SUTD Capstone pitch deck ("use this text as-is").
// Nothing in this file is authored — if a line reads oddly, fix the deck.

// revise.md emphasises parts of the eyebrow and subtitle. Carried as segments
// so the emphasis survives without a markdown parser; `em` marks the run the
// deck sets apart.
export const LANDING = {
  eyebrow: [
    { t: "An invitation to " },
    { t: "SUTD's", em: true },
  ],
  title: "Capstone",
  subtitle: [
    { t: "A " },
    { t: "Final Year", em: true },
    { t: " Project — Value and Development " },
    { t: "Opportunities", em: true },
  ],
  pills: [
    "8 Months Applied R&D",
    "100% Sponsor IP Retention",
    "7 Senior UG Team",
  ],
  strive: {
    heading: "What We Strive For",
    body: "A practical, fully integrated solution ready for real use. Software, business, and hardware expertise in one team, taking a problem from requirements to a working outcome.",
  },
  majors: [
    { code: "CSD", name: "Computer Science and Design" },
    { code: "ESD", name: "Engineering Systems and Design" },
    { code: "EPD", name: "Engineering Product Development" },
  ],
  cta: "Explore the team",
};

export const WHAT_IS = {
  heading: "What is Capstone?",
  intro: "An 8-month, industry-based final-year undergraduate project where students apply academic knowledge and technical competencies to address real-world, multidisciplinary challenges.",
  cards: [
    {
      icon: "building",
      title: "Industry-Defined Problems",
      body: "Industry partners propose real-world challenges drawn from their operational needs or strategic priorities. Unlike traditional academic projects, these challenges are defined by actual industry requirements, allowing students to work on practical and relevant problems.",
    },
    {
      icon: "people",
      title: "Multidisciplinary Teams",
      body: "Each team comprises students from different disciplines, bringing together diverse technical expertise and perspectives. With guidance from SUTD faculty, teams collaborate to develop holistic solutions to complex industry challenges.",
    },
    {
      icon: "documentCheck",
      title: "Implementable Outcome",
      body: "Teams translate identified challenges into practical and implementable solutions. At the end of the project, industry partners receive a substantial body of work that directly addresses the challenge they proposed.",
    },
  ],
};

export const BENEFITS = {
  heading: "Benefits from Capstone",
  intro: "A cost-effective, low-risk opportunity to engage a dedicated multidisciplinary team in addressing challenges your organisation may not have the capacity to pursue internally.",
  cards: [
    {
      icon: "scale",
      title: "A Cost-Effective & Experienced Team",
      body: "SUTD students apply multidisciplinary expertise to real-world projects throughout their degree, providing industry partners with a skilled team to develop practical solutions at a fraction of the cost of an equivalent intern team.",
    },
    {
      icon: "compass",
      title: "Explore New Avenues",
      body: "Capstone enables industry partners to explore ideas that may have been constrained by limited resources, time, or competing priorities. Teams can evaluate and develop these opportunities without diverting internal staff from ongoing responsibilities.",
    },
    {
      icon: "shield",
      title: "Full IP Ownership",
      body: "Industry partners retain ownership of intellectual property generated through the project, enabling them to further develop, license, or commercialise the resulting designs, prototypes, and solutions.",
    },
  ],
};

export const TIMELINE = {
  heading: "Project Timeline",
  milestones: [
    { icon: "envelope",     phase: "Project Sourcing",   date: "Now – Jan 2027",  body: "Discuss company needs and team fit" },
    { icon: "documentPen",  phase: "Project Scoping",    date: "Feb – Mar 2027",  body: "Define project requirements and goals" },
    { icon: "verified",     phase: "Approval from SUTD", date: "Apr – Jun 2027",  body: "Sign legal agreements with SUTD" },
    { icon: "magnifier",    phase: "Discover & Define",  date: "Sep – Dec 2027",  body: "Define the problem and create MVPs" },
    { icon: "gears",        phase: "Develop & Deliver",  date: "Jan – May 2028",  body: "Execute & refine solutions" },
  ],
};
