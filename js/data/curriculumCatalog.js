/**
 * Published Catholic Faith Formation learning structure.
 * Only areas and topics with real linked lesson content are listed here.
 * Planned content belongs in product documentation, not empty UI placeholders.
 */
export const faithFormationAreas = [
  {
    id: "sacred-scripture",
    title: "Sacred Scripture",
    description: "Learn how to approach the Bible and understand the Catholic biblical canon.",
    topics: [
      { id: "reading-scripture", title: "Reading and Understanding Scripture", summary: "Approach a biblical passage with attention to context and meaning.", lessonIds: ["reading-the-bible"] },
      { id: "catholic-bible-structure", title: "The Structure of the Catholic Bible", summary: "Explore the Old Testament, New Testament and Catholic canon.", lessonIds: ["bible-library"] }
    ]
  },
  {
    id: "prayer-spiritual-life",
    title: "Prayer & Spiritual Life",
    description: "Build a thoughtful, steady and Scripture-rooted life of prayer.",
    topics: [
      { id: "foundations-of-prayer", title: "Foundations of Christian Prayer", summary: "Understand prayer and practise a simple pattern of Scripture reflection.", lessonIds: ["prayer-and-reflection"] }
    ]
  }
];
