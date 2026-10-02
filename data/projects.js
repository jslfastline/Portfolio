/**
 * FASTLINE TECHNOLOGIES — PROJECT DATA
 * Single source of truth for every product on the network.
 * Add a new project by pushing a new object — the site renders it.
 * Only include real URLs. Missing optional fields are null (UI hides them).
 */
window.FASTLINE_PROJECTS = [
  {
    title: "FeMOS",
    slug: "femos",
    category: "Campus Operating System",
    sub: "FastLine Enterprises Modern Operation System",
    status: "IN DEVELOPMENT",
    statusKey: "in-dev",
    description:
      "An operating system for an entire campus. FeMOS replaces paper attendance and scattered announcements with one unified, offline-capable platform for students, lecturers and administrators.",
    problem:
      "Tanzanian universities still run on paper attendance registers and WhatsApp broadcast groups. Attendance can be doctored, announcements never reach everyone, there is no single student identity, and campuses often lose internet right when they need systems most.",
    idea:
      "Give every campus one system — attendance, announcements and identity — that works even when the internet does not, and make it impossible to fake.",
    solution:
      "A Progressive Web Application with per-campus edge servers: Smart Attendance with rotating QR and geofencing, Smart Announcements with mandatory read-acknowledgement, and a permanent Student Unique Identity with QR and NFC support.",
    howItWorks: [
      "A student signs in by scanning a rotating, time-limited QR code at the lecture venue.",
      "Geofencing and device fingerprinting reject signs-in made outside the campus or from cloned devices.",
      "Attendance and timestamps sync instantly over the campus network and are queued offline when connectivity drops.",
      "Administrators see live dashboards; announcements carry a read-acknowledgement trail so nobody can claim they did not see it.",
    ],
    capabilities: [
      "Smart Attendance — real-time, fraud-proof sign-in",
      "Smart Announcements — offline delivery queue + read acknowledgment",
      "Student Unique Identity — permanent FEMOS IDs, QR & NFC",
      "Edge Servers — per-campus infrastructure, zero internet needed",
      "Anti-Fraud — rotating QR, geofencing, device fingerprinting",
    ],
    technologies: ["PWA", "Node.js", "PostgreSQL", "Redis", "WebSockets", "IndexedDB"],
    thumbnail: "https://res.cloudinary.com/j8zmetxr/image/upload/v1789212897/FeMOS_phone_nobg_pmxxay.png",
    logo: "https://res.cloudinary.com/j8zmetxr/image/upload/v1785401966/FeOS_fem2ge.png",
    videoUrl: null,
    poster: null,
    liveUrl: null,
    scope: "Proposal · Pilot universities: MUST · UDSM · UDOM",
  },
  {
    title: "Neo SmartCore",
    slug: "neo-smartcore",
    category: "Business Operations Intelligence",
    sub: "Intelligent Automation & AI Engine",
    status: "PROTOTYPE",
    statusKey: "prototype",
    description:
      "A smart-core engine that gives business applications operational visibility, stock monitoring, daily reporting and control — by making software think, learn and act on the data it holds.",
    problem:
      "Businesses run on scattered spreadsheets and manual daily reporting. Owners cannot see stock, sales and operations in one place, and decisions lag behind reality.",
    idea:
      "Build a reusable intelligence core that any business application can plug into — so visibility, prediction and automation become built-in rather than bolted on.",
    solution:
      "Neo SmartCore augments applications with an adaptive decision engine, predictive processing and smart-sync behaviour. It watches operational data, surfaces what matters, and automates routine decisions.",
    howItWorks: [
      "Inputs — sales, stock, time-based events — flow into the core from connected modules.",
      "The core analyses patterns and flags anomalies, stock thresholds and daily summaries.",
      "Automated actions fire for routine decisions while exceptions are escalated to a human.",
      "Everything keeps working offline and synchronises intelligently when a connection returns.",
    ],
    capabilities: [
      "Operational visibility & daily reporting",
      "Stock monitoring with smart thresholds",
      "Adaptive decision engine",
      "Predictive processing models",
      "Smart sync & offline logic",
      "Lightweight, modular design",
    ],
    technologies: ["AI Engine", "Automation", "Core Engine", "Data Intelligence"],
    thumbnail: "https://res.cloudinary.com/j8zmetxr/image/upload/v1789212918/NeoSmartCore_Icon_1024_zj2ycl.png",
    logo: "https://res.cloudinary.com/j8zmetxr/image/upload/v1789212918/NeoSmartCore_Icon_transparent_1024_obfxg6.png",
    videoUrl: null,
    poster: null,
    liveUrl: null,
    scope: "Prototype · Core engine",
  },
  {
    title: "FIT",
    slug: "fit",
    category: "Identification & Attendance Technology",
    sub: "FastLine Identifying Technology",
    status: "CONCEPT",
    statusKey: "concept",
    description:
      "An identification and attendance technology ecosystem that combines digital identity, device interaction and QR-based workflows into one verifiable system.",
    problem:
      "Identity is scattered. Attendance, access and verification each live in separate silos — with no shared, tamper-resistant way to prove who a person is in a moment.",
    idea:
      "One identification layer reused across the ecosystem — a person's digital identity that can be verified instantly via device interaction and QR workflows.",
    solution:
      "FIT unifies digital identity, device pairing and QR-based check-in and verification so the same identity works for attendance, access and authorisation across FastLine systems.",
    howItWorks: [
      "A person's identity is anchored to a unique, verifiable ID with device binding.",
      "QR workflows let attendees check in or verify identity without special hardware.",
      "Device interaction (NFC / proximity) confirms presence against the anchored identity.",
      "Each event writes a tamper-evident record that ties person, device, time and place.",
    ],
    capabilities: [
      "Portable digital identity",
      "QR-based attendance & verification",
      "Device interaction & pairing",
      "Tamper-evident event records",
    ],
    technologies: ["Identity", "QR", "Device Interaction"],
    thumbnail: null,
    logo: null,
    videoUrl: null,
    poster: null,
    liveUrl: null,
    scope: "Concept · Ecosystem layer",
  },
  {
    title: "JSL FastLine",
    slug: "jsl-fastline",
    category: "Low-Connectivity Digital Ecosystem",
    sub: "Offline-First AI-Powered Social & Growth Platform",
    status: "CONCEPT",
    statusKey: "concept",
    description:
      "A mobile platform designed for the reality of African handsets, data costs and intermittent connectivity — communication, growth tools and AI coaching that work at zero signal.",
    problem:
      "Most platforms assume a reliable connection and unlimited data. Large parts of Africa do not have that, so whole communities are locked out of modern software.",
    idea:
      "Design the platform from the offline up: functionality first, connectivity as an upgrade — not the other way around.",
    solution:
      "A 5-tab mobile platform (Home, Chats, Grow, Groups, Profile) built with an offline engine, devices that talk to each other with no tower, an on-device AI coach, a Truth Layer against misinformation, and Focus Mode that limits its own use.",
    howItWorks: [
      "Cores stay fully functional with zero signal — content is queued and synced when a connection appears.",
      "JSL Mesh lets nearby devices exchange data over Bluetooth / WiFi Direct when there is no network.",
      "The on-device AI coach learns locally (TensorFlow Lite) and blends cloud intelligence when available.",
      "The Truth Layer marks verified humans, AI and disputed content; Focus Mode monitors and limits usage.",
    ],
    capabilities: [
      "5 integrated tabs: Home · Chats · Grow · Groups · Profile",
      "Offline Engine + JSL Mesh (P2P Bluetooth / WiFi Direct)",
      "On-device AI Coach (offline TensorFlow Lite + cloud hybrid)",
      "Truth Layer — verified / AI / disputed badges on every post",
      "Focus Mode — anti-addiction, self-limiting design",
      "Wisdom Economy & JSL ID — verified skills, tokens, portable identity",
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Firebase", "WatermelonDB", "TensorFlow Lite"],
    thumbnail: "https://res.cloudinary.com/j8zmetxr/image/upload/v1786904172/wgq58kbtbhxhmm3vyuwb.jpg",
    logo: "https://res.cloudinary.com/j8zmetxr/image/upload/v1786904172/wgq58kbtbhxhmm3vyuwb.jpg",
    videoUrl: null,
    poster: null,
    liveUrl: null,
    scope: "Concept · Proposal v1.0",
  },
];