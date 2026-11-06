import bibleKnowledge from "./bible-knowledge.js";
import catholicDoctrine from "./catholic-doctrine.js";
import saintsAndVirtues from "./saints-and-virtues.js";
import riddles from "./riddles.js";
import legionOfMary from "./legion-of-mary.js";
import sacredHeart from "./sacred-heart.js";
import stAnthony from "./st-anthony.js";
import otherDevotions from "./other-devotions.js";
import pictureQuiz from "./picture-quiz.js";

export const questionBanks = {
  "bible-knowledge": bibleKnowledge,
  "catholic-doctrine": catholicDoctrine,
  "saints-and-virtues": saintsAndVirtues,
  "riddles": riddles,
  "legion-of-mary": legionOfMary,
  "sacred-heart": sacredHeart,
  "st-anthony": stAnthony,
  "other-devotions": otherDevotions,
  "picture-quiz": pictureQuiz,
};

export const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "bible-knowledge", label: "Bible Knowledge" },
  { value: "catholic-doctrine", label: "Catholic Doctrine" },
  { value: "saints-and-virtues", label: "Saints and Virtues" },
  { value: "riddles", label: "Riddles" },
  { value: "picture-quiz", label: "Picture Quiz" },
  { value: "legion-of-mary", label: "Legion of Mary" },
  { value: "sacred-heart", label: "Sacred Heart" },
  { value: "st-anthony", label: "St. Anthony" },
  { value: "other-devotions", label: "Other Catholic Pious Societies and Devotions" },
];
