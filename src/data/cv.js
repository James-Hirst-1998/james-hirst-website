import mozaicLogo from "../assets/mozaic.png";
import microsoftLogo from "../assets/microsoft.png";
import cambridgeLogo from "../assets/cambridge.jpg";
import sharkTrustLogo from "../assets/shark_trust.jpg";

export const EMAIL = "hirst.jj@googlemail.com";
export const BIRTH_DATE = "1998-11-07";

export const age = () => {
  const dob = new Date(BIRTH_DATE);
  const today = new Date();
  let a = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
  return a;
};

export const sections = [
  {
    id: "surface",
    nav: "Surface",
    depth: 0,
    zone: "The surface",
  },
  {
    id: "mozaic",
    nav: "Mozaic Earth",
    depth: 40,
    zone: "Sunlight zone",
    kicker: "Now · Founding engineer",
    title: "Mozaic Earth",
    logo: mozaicLogo,
    link: { href: "https://www.mozaic.earth/", label: "mozaic.earth" },
    body: [
      "I'm a founding engineer at Mozaic Earth, an early-stage startup building a platform that lets anyone with a mobile phone collect biodiversity data through an intuitive app. The data is interpreted by ecologists on our web platform, super-charged by our AI tools.",
    ],
    bullets: [
      "Architecting and managing the Supabase database - functions, triggers and edge functions",
      "Leading design and development of the web platform, scoping and reviewing a small team's work",
      "Owning all AI initiatives: building models, data pipelines and researching new technologies",
      "Shipping full-stack features across Figma, Supabase, React, Flutter and Retool",
      "Working with clients on project delivery and insight-rich reports via custom SQL workflows",
    ],
  },
  {
    id: "microsoft",
    nav: "Microsoft",
    depth: 150,
    zone: "Sunlight zone",
    kicker: "Previously · Software engineer",
    title: "Microsoft",
    logo: microsoftLogo,
    body: [
      "I built a Rust-based configuration translation solution for a session border controller at the edge of telco networks, with an extensive testing framework that automatically regenerated expected outputs as the translation grew. Before that I worked on a highly reliable voicemail solution in Azure - Kubernetes for resource management, plus Grafana, Prometheus and Terraform.",
    ],
    bullets: [
      "GitHub Copilot Champion - educating engineers on features and best practice",
      "Redesigned CI and solution architecture; scrum master for a team of ten",
      "Designed and owned a security bot to combat threats, and led cost-reduction initiatives",
      "Ran a sustainability series, giving talks on fishing and carbon-removal companies",
    ],
  },
  {
    id: "research",
    nav: "Research",
    depth: 450,
    zone: "Twilight zone",
    kicker: "Machine learning · University of Cambridge",
    title: "Tree crown delineation",
    logo: cambridgeLogo,
    link: {
      href: "https://www.biorxiv.org/content/10.1101/2022.07.10.499480v1.full.pdf",
      label: "Read the paper",
    },
    body: [
      "With the Plant Sciences department at Cambridge, I applied machine learning to improve forest carbon storage estimates - using Facebook's Detectron2 on diverse forest datasets to delineate tree crowns from drone imagery. The results were published and enhance current landmass-based methods.",
    ],
    bullets: [
      "Partitioned drone imagery into training and testing sets",
      "Compared manual and AI-delineated crowns with F1 scores",
      "Used LiDAR crown heights to measure accuracy on tall trees",
    ],
  },
  {
    id: "sharktrust",
    nav: "Shark Trust",
    depth: 850,
    zone: "Twilight zone",
    kicker: "Volunteering · Conservation tech",
    title: "The Shark Trust",
    logo: sharkTrustLogo,
    link: {
      href: "https://www.sharktrust.org/greateggcasehunt",
      label: "The Great Eggcase Hunt",
    },
    internalLink: {
      to: "/creatures#shark",
      label: "Meet the sharks - a few of my favourites",
    },
    body: [
      "As a passionate conservationist I volunteer my technical skills for environmental protection. I'm building convolutional neural networks that automate shark and ray species classification from eggcase photos, contributing to the Shark Trust's Great Eggcase Hunt.",
      "I train the models and handle data collection and cleaning. The goal is to integrate classification directly into the app - letting the project expand globally while keeping the Trust's workload manageable.",
    ],
  },
  {
    id: "education",
    nav: "Education",
    depth: 1800,
    zone: "Midnight zone",
    kicker: "Education",
    title: "Cambridge mathematics",
    education: [
      {
        title: "University of Cambridge · Jesus College",
        period: "2018 - 2022",
        detail:
          "MMath & BA in Mathematics - Masters passed with Distinction, first class in every undergraduate year.",
        stats: [
          { value: "79%", label: "Masters - Distinction" },
          { value: "14th of 222", label: "third-year ranking" },
          { value: "Top of college", label: "Jesus College Mathematics Award" },
        ],
      },
      {
        title: "Sixth form",
        period: "A-Levels",
        detail:
          "Maths, Further Maths, Additional Further Maths, Physics and Chemistry - plus Head Boy in my final year.",
        stats: [
          { value: "5 A*s", label: "A-Level results" },
          { value: "Head Boy", label: "final year" },
        ],
      },
    ],
    highlight: {
      title: "CERN - Beamline for Schools",
      text: "I co-led a team of 17 students to win CERN's global physics competition, running our experiment on their third-biggest particle accelerator to test special relativity by measuring particle time-of-flight. Spoiler: Einstein is still correct - and we published the results in IOP Science.",
      href: "https://iopscience.iop.org/article/10.1088/1361-6552/aaccdb",
    },
  },
  {
    id: "skills",
    nav: "Skills",
    depth: 3500,
    zone: "Midnight zone",
    kicker: "Toolkit",
    title: "Skills",
    skills: [
      {
        group: "Coding",
        items: ["Python", "TypeScript / React", "Rust", "SQL", "Dart / Flutter", "HTML / CSS"],
      },
      {
        group: "Cloud & DevOps",
        items: ["Azure", "Kubernetes", "Terraform", "Docker", "GCP", "CI/CD"],
      },
      {
        group: "Tools & platforms",
        items: ["Supabase", "Retool", "Figma", "ML model hosting", "FastAPI", "TensorFlow"],
      },
    ],
  },
  {
    id: "beyond",
    nav: "Beyond code",
    depth: 5500,
    zone: "Abyssal zone",
    kicker: "Beyond the code",
    title: "Off duty",
    cards: [
      {
        title: "Skiing",
        text: "I completed a ski season managing a restaurant in Val d'Isère in 2017/18, and captained the Cambridge University Freestyle Ski Team for two years - including premiering a film with Faction Skis.",
        href: "https://www.youtube.com/watch?v=wZfKq0VAW_E",
        linkLabel: "Watch the edit",
      },
      {
        title: "Conservation",
        text: "Hugely passionate about the natural world, particularly marine life - I'm PADI Open Water qualified. If you have a conservation project that needs an engineer, I'd love to hear about it.",
      },
      {
        title: "Tutoring",
        text: "I've tutored A-Level Maths and Physics, school entrance exams and MBA maths skills. I'm open to new students - drop me an email.",
      },
    ],
  },
  {
    id: "seabed",
    nav: "Seabed",
    depth: 10935,
    zone: "Challenger Deep",
  },
];

export const MAX_DEPTH = 10935;

// Sections are evenly spaced in scroll but their real-world depths are not,
// so the live meter piecewise-interpolates between section depths.
export const depthAtProgress = (progress) => {
  const p = Math.min(Math.max(progress, 0), 1);
  const spans = sections.length - 1;
  const idx = Math.min(Math.floor(p * spans), spans - 1);
  const frac = p * spans - idx;
  return sections[idx].depth + (sections[idx + 1].depth - sections[idx].depth) * frac;
};

export const zoneAtDepth = (depth) => {
  if (depth < 5) return "the surface";
  if (depth < 200) return "sunlight zone";
  if (depth < 1000) return "twilight zone";
  if (depth < 4000) return "midnight zone";
  if (depth < 6000) return "abyssal zone";
  if (depth < 10900) return "hadal zone";
  return "challenger deep";
};
