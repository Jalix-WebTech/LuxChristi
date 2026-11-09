/**
 * Public Lux Christi event catalogue.
 *
 * Keep this array empty until an organiser has approved and supplied the
 * official event details. Do not publish sample dates, eligibility rules,
 * registration links or meeting credentials as if they were real events.
 *
 * Future event record shape:
 * {
 *   id: "unique-event-id",
 *   title: "Official event title",
 *   category: "Bible Quiz",
 *   description: "Approved public description.",
 *   status: "upcoming",
 *   featured: false,
 *   startsAt: "2027-03-20T14:00:00+01:00", // ISO 8601 with timezone offset
 *   timeZone: "Africa/Lagos", // IANA timezone used for the published event time
 *   registrationOpensAt: null,
 *   registrationClosesAt: null,
 *   venue: "Online",
 *   mode: "Online",
 *   eligibility: [],
 *   guidelines: [],
 *   platforms: { quiz: "Kahoot", meeting: "Zoom", broadcast: "YouTube Live" },
 *   publicLinks: { information: null, broadcast: null },
 *   privateInstructions: null, // Never expose private joining links publicly.
 *   resultsUrl: null,
 *   winners: []
 * }
 */
export const events = [];

export const eventCategories = [
  { id: "bible-quiz", name: "Bible Quiz", description: "Explore Scripture and the message of God's Word." },
  { id: "catholic-doctrine", name: "Catholic Doctrine", description: "Deepen your understanding of Catholic teaching." },
  { id: "saints-history", name: "Saints & Church History", description: "Discover the people and story of the Church." },
  { id: "faith-knowledge", name: "Catholic Faith Knowledge", description: "Put your wider knowledge of the Catholic faith to the test." },
  { id: "scripture-challenge", name: "Scripture Challenge", description: "Take on focused challenges rooted in Sacred Scripture." }
];
