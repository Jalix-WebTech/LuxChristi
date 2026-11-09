/**
 * Curated public learning resources for the Lux Christi Learning Centre.
 * External resources require an internet connection unless the provider
 * independently offers offline access or a downloadable document.
 */
export const learningResources = [
  {
    id: "bible-vatican",
    title: "The Bible — New American Bible",
    category: "scripture",
    type: "Bible",
    provider: "United States Conference of Catholic Bishops",
    description: "Read the Bible online with book, chapter and verse navigation.",
    url: "https://bible.usccb.org/bible",
    tags: ["Bible", "Scripture", "Reading"]
  },
  {
    id: "daily-readings",
    title: "Daily Mass Readings",
    category: "scripture",
    type: "Daily reading",
    provider: "United States Conference of Catholic Bishops",
    description: "Follow the USCCB daily readings and reflect on the Word of God. Check your local diocesan calendar where observances differ.",
    url: "https://bible.usccb.org/readings/calendar",
    tags: ["Mass", "Daily readings", "Reflection"]
  },
  {
    id: "understanding-bible",
    title: "Understanding the Bible",
    category: "scripture",
    type: "Study guide",
    provider: "United States Conference of Catholic Bishops",
    description: "An introduction to Catholic approaches to reading and understanding Scripture.",
    url: "https://www.usccb.org/bible/understanding-the-bible",
    tags: ["Bible study", "Scripture", "Catholic reading"]
  },
  {
    id: "catechism",
    title: "Catechism of the Catholic Church",
    category: "teaching",
    type: "Reference text",
    provider: "The Holy See",
    description: "Explore the Church's presentation of Catholic faith and doctrine.",
    url: "https://www.vatican.va/archive/ENG0015/_INDEX.HTM",
    tags: ["Catechism", "Doctrine", "Faith"]
  },
  {
    id: "vatican-documents",
    title: "Papal and Vatican Documents",
    category: "teaching",
    type: "Official documents",
    provider: "The Holy See",
    description: "Find official documents, encyclicals and other resources published by the Vatican.",
    url: "https://www.vatican.va/content/vatican/en.html",
    tags: ["Vatican", "Church documents", "Teaching"]
  },
  {
    id: "usccb-faith",
    title: "Catholic Teaching and Faith Resources",
    category: "teaching",
    type: "Learning resource",
    provider: "United States Conference of Catholic Bishops",
    description: "Browse introductory resources on Catholic beliefs, worship and life.",
    url: "https://www.usccb.org/beliefs-and-teachings",
    tags: ["Catholic faith", "Teaching", "Learning"]
  },
  {
    id: "saints-vatican",
    title: "Saints and Blesseds",
    category: "saints",
    type: "Reference collection",
    provider: "The Holy See",
    description: "Explore Vatican information and documents relating to saints and beatification.",
    url: "https://www.vatican.va/roman_curia/congregations/csaints/index.htm",
    tags: ["Saints", "Holiness", "Inspiration"]
  },
  {
    id: "newman-society",
    title: "Causes of Saints",
    category: "saints",
    type: "Official Church resource",
    provider: "Dicastery for the Causes of Saints",
    description: "Visit the Holy See office responsible for causes of beatification and canonisation.",
    url: "https://www.causesanti.va/",
    tags: ["Saints", "Beatification", "Canonisation"]
  },
  {
    id: "rosary-usccb",
    title: "Prayers and Catholic Devotions",
    category: "prayer",
    type: "Prayer resource",
    provider: "United States Conference of Catholic Bishops",
    description: "Find prayer resources and material for Catholic devotion and worship.",
    url: "https://www.usccb.org/prayer-and-worship",
    tags: ["Prayer", "Devotion", "Worship"]
  },
  {
    id: "liturgical-calendar",
    title: "Liturgical Calendar",
    category: "prayer",
    type: "Calendar reference",
    provider: "United States Conference of Catholic Bishops",
    description: "Explore the liturgical year, celebrations and the rhythm of Catholic worship.",
    url: "https://www.usccb.org/prayer-and-worship/liturgical-year",
    tags: ["Liturgy", "Calendar", "Worship"]
  },
  {
    id: "vatican-library",
    title: "Vatican Library and Archives",
    category: "study",
    type: "Research collection",
    provider: "The Holy See",
    description: "Discover historical manuscripts, collections and research resources.",
    url: "https://www.vaticanlibrary.va/",
    tags: ["Research", "History", "Library"]
  },
  {
    id: "catholic-education",
    title: "Catholic Education Resources",
    category: "study",
    type: "Education resource",
    provider: "United States Conference of Catholic Bishops",
    description: "Explore resources connected with Catholic education and formation.",
    url: "https://www.usccb.org/committees/catholic-education",
    tags: ["Education", "Formation", "Study"]
  },
  {
    id: "vatican-youth",
    title: "Youth and Young People",
    category: "study",
    type: "Formation resource",
    provider: "The Holy See",
    description: "Use official Church resources as a starting point for youth formation and reflection.",
    url: "https://www.usccb.org/committees/catholic-education/get-educated",
    tags: ["Youth", "Formation", "Faith"]
  }
];

export const learningCategories = [
  { id: "all", label: "All resources" },
  { id: "scripture", label: "Scripture" },
  { id: "teaching", label: "Church teaching" },
  { id: "saints", label: "Saints & virtues" },
  { id: "prayer", label: "Prayer & liturgy" },
  { id: "study", label: "Study & formation" }
];
