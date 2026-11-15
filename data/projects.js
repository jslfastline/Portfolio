/**
 * FastLine Technologies — Project Data
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
      "Give every campus one system — attendance, announcements and identity — that works even when the internet does not, and makes attendance records harder to falsify and easier to audit.",
    solution:
      "A Progressive Web Application with per-campus edge servers: attendance with rotating QR and geofencing, announcements with read-acknowledgement, and a persistent student identity with QR and NFC support.",
    howItWorks: [
      "A student signs in by scanning a rotating, time-limited QR code at the lecture venue.",
      "Geofencing and device checks flag sign-ins made outside the campus or from a device already linked to another student.",
      "Attendance and timestamps sync over the campus network and are queued offline when connectivity drops.",
      "Administrators see live dashboards; announcements carry a read-acknowledgement trail so delivery can be checked."
    ],
    capabilities: [
      "Attendance — real-time sign-in with an auditable record",
      "Announcements — offline delivery queue + read acknowledgement",
      "Student Identity — persistent FeMOS IDs, QR & NFC",
      "Edge Servers — per-campus infrastructure, no internet required",
      "Integrity checks — rotating QR, geofencing, device checks",
    ],
    technologies: ["PWA", "Node.js", "PostgreSQL", "Redis", "WebSockets", "IndexedDB"],
    thumbnail: "https://res.cloudinary.com/j8zmetxr/image/upload/v1789212897/FeMOS_phone_nobg_pmxxay.png",
    logo: "https://res.cloudinary.com/j8zmetxr/image/upload/v1785401966/FeOS_fem2ge.png",
    videoUrl: null,
    poster: null,
    liveUrl: null,
    scope: "Proposal · Proposed pilots: MUST · UDSM · UDOM (unconfirmed)",
  },
  {
    title: "Neo SmartCore",
    slug: "neo-smartcore",
    category: "Business Operations Systems",
    sub: "Reusable Operations Core",
    status: "PROTOTYPE",
    statusKey: "prototype",
    description:
      "A business operations engine that gives applications stock visibility, daily reporting and exception alerts by reading the operational data they already hold.",
    problem:
      "Businesses run on scattered spreadsheets and manual daily reporting. Owners cannot see stock, sales and operations in one place, and decisions lag behind reality.",
    idea:
      "Build a reusable operations core that business applications can plug into, so visibility and routine reporting are built in rather than rebuilt for every product.",
    solution:
      "Neo SmartCore connects to sales, stock and time-based records, summarises daily activity, flags stock thresholds and exceptions, and automates routine reporting while leaving judgement calls to a person.",
    howItWorks: [
      "Sales, stock and time-based records flow into the core from connected modules.",
      "The core summarises daily activity and flags stock thresholds and unusual changes.",
      "Routine reports are generated automatically; exceptions are raised for a person to review.",
      "Data is queued offline and synchronised when a connection returns."
    ],
    capabilities: [
      "Operational visibility & daily reporting",
      "Stock monitoring with configurable thresholds",
      "Rules-based exception alerts",
      "Trend summaries from historical data",
      "Offline queue & smart sync",
      "Lightweight, modular design",
    ],
    technologies: ["Operations Core", "Automation", "Reporting", "Offline Sync"],
    thumbnail: "https://res.cloudinary.com/j8zmetxr/image/upload/v1789212918/NeoSmartCore_Icon_1024_zj2ycl.png",
    logo: "https://res.cloudinary.com/j8zmetxr/image/upload/v1789212918/NeoSmartCore_Icon_transparent_1024_obfxg6.png",
videoUrl: "https://res.cloudinary.com/dlv2esvfc/video/upload/v1790959148/Smatco_duyug5.mp4",
    poster: "https://res.cloudinary.com/dlv2esvfc/video/upload/w_1280,f_jpg,so_0/v1790959148/Smatco_duyug5.jpg",
    scope: "Prototype · Core engine",
  },
  {
    title: "FastLine Identifying Tool",
    slug: "fit",
    category: "Digital Identity & Attendance",
    sub: "Digital identity, attendance and verification",
    status: "CONCEPT",
    statusKey: "concept",
    description:
      "An identification and attendance system that combines a portable digital credential, device interaction and verification workflows into one identity layer.",
    problem:
      "Identity is scattered. Attendance, access and verification each live in separate records — with no shared, auditable way to confirm who a person is in a given moment.",
    idea:
      "One identification layer reused across the ecosystem — a digital credential that can be checked through device interaction and check-in workflows.",
    solution:
      "The FastLine Identifying Tool ties a person's credential to device pairing and check-in events, so the same identity can be used for attendance, access and authorisation across FastLine systems.",
    howItWorks: [
      "A person's identity is anchored to a unique credential with device binding.",
      "Check-in workflows let a person confirm attendance or identity without special hardware.",
      "Device interaction (NFC / proximity) checks presence against the anchored credential.",
      "Each event writes an auditable record that ties person, device, time and place.",
    ],
    capabilities: [
      "Portable digital credential",
      "Attendance & identity verification workflows",
      "Device interaction & pairing",
      "Auditable event records",
    ],
    technologies: ["Digital Identity", "Device Interaction", "Verification"],
    thumbnail: "assets/images/project-fit.svg",
    logo: null,
    videoUrl: null,
    poster: null,
    liveUrl: null,
    scope: "Concept · Early architecture",
  },
  {
    title: "JSL FastLine",
    slug: "jsl-fastline",
    category: "Low-Connectivity Digital Ecosystem",
    sub: "Offline-First Social & Growth Platform",
    status: "CONCEPT",
    statusKey: "concept",
    description:
      "A mobile platform designed for African handsets, data costs and intermittent connectivity — communication, growth tools and an on-device coach that work without signal.",
    problem:
      "Most platforms assume a reliable connection and unlimited data. Large parts of Africa do not have that, so whole communities are locked out of modern software.",
    idea:
      "Design the platform from the offline up: functionality first, connectivity as an upgrade — not the other way around.",
    solution:
      "A five-tab mobile platform (Home, Chats, Grow, Groups, Profile) built around an offline engine, device-to-device sharing over Bluetooth or Wi-Fi Direct, an on-device coach, source labels on posts, and a focus mode that limits its own use.",
    howItWorks: [
      "Core features stay usable with no signal — content is queued and synced when a connection appears.",
      "JSL Mesh lets nearby devices exchange data over Bluetooth or Wi-Fi Direct when there is no network.",
      "The on-device coach runs locally (TensorFlow Lite) and can use cloud models when a connection is available.",
      "Posts carry source labels for people, AI-generated content and disputed claims; Focus Mode monitors and limits usage.",
    ],
    capabilities: [
      "5 integrated tabs: Home · Chats · Grow · Groups · Profile",
      "Offline engine + JSL Mesh (device-to-device over Bluetooth / Wi-Fi Direct)",
      "On-device coach (offline TensorFlow Lite, optional cloud models)",
      "Source labels for people, AI-generated content and disputed claims",
      "Focus Mode — self-limiting usage controls",
      "JSL ID — a portable profile for verified skills",
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