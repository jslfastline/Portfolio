/**
 * FastLine Technologies — "Inside FastLine" engineering log
 *
 * This file is the only place updates are added. The homepage renderer
 * (site.js) reads window.FASTLINE_UPDATES and builds the list automatically.
 *
 * Schema for each entry:
 * {
 *   date: "YYYY-MM-DD",              // required — the real date the work happened
 *   title: "Short, factual headline", // required — no marketing claims
 *   summary: "What changed and why it matters.", // required — plain description
 *   tag: "Milestone",                // optional — e.g. Milestone, Prototype, Release, Lesson
 *   image: "/assets/images/femos.jpg", // optional — path to a real screenshot or photo
 *   imageAlt: "FeMOS dashboard",     // optional — defaults to the entry title
 *   link: "/projects/femos",         // optional — internal path or full https URL
 *   linkLabel: "Explore FeMOS"       // optional — defaults to "Read more"
 * }
 *
 * Honesty rule: only add an entry after the work is real. Do not add
 * announcements, predictions, invented milestones, customers or statistics.
 * The list stays empty until there is something genuine to report.
 */
window.FASTLINE_UPDATES = [];
