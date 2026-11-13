import bibleKnowledge from "./bible-knowledge.js";
import catholicDoctrine from "./catholic-doctrine.js";
import saintsAndVirtues from "./saints-and-virtues.js";
import riddles from "./riddles.js";
import legionOfMary from "./legion-of-mary.js";
import sacredHeart from "./sacred-heart.js";
import stAnthony from "./st-anthony.js";
import otherDevotions from "./other-devotions.js";
import { categoryOptions } from "./categories.js";

export { categoryOptions };

export const questionBanks = {
  "bible-knowledge": bibleKnowledge,
  "catholic-doctrine": catholicDoctrine,
  "saints-and-virtues": saintsAndVirtues,
  "riddles": riddles,
  "legion-of-mary": legionOfMary,
  "sacred-heart": sacredHeart,
  "st-anthony": stAnthony,
  "other-devotions": otherDevotions,
};
