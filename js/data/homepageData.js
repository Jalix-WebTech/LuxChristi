import { gameCatalog } from "../games/catalog.js";
import { categoryOptions } from "../question-banks/categories.js";
import { questionBankCatalog } from "../question-banks/catalog.js";
import { learningResources } from "./learningResources.js";
import { events } from "./events.js";
import { ACHIEVEMENT_TIERS } from "../quiz/achievements.js";

/** Homepage catalogue is derived from existing project content, not duplicated. */
export const homepageCatalogue = {
  games: gameCatalog.map(game => ({
    id: game.id,
    title: game.title,
    description: game.description,
    icon: game.icon,
    image: game.image,
    difficulty: "Faith activity",
    duration: `${game.roundCount} rounds`,
    destination: `quiz.html?activity=games&selection=${encodeURIComponent(game.id)}#activitySelection`,
    category: game.category,
    status: "published"
  })),
  quizzes: categoryOptions.filter(item => item.value !== "all").map(category => ({
    id: category.value,
    title: category.label,
    description: `Explore questions in ${category.label.toLowerCase()}.`,
    image: "assets/images/quizzes/catholic-quiz.svg",
    questionCount: questionBankCatalog.find(item => item.id === category.value)?.questionCount || 0,
    category: ({ "bible-knowledge": "scripture", "catholic-doctrine": "doctrine", "saints-and-virtues": "saints", "riddles": "puzzles", "legion-of-mary": "devotions", "sacred-heart": "devotions", "st-anthony": "saints", "other-devotions": "devotions" })[category.value] || "other",
    destination: `quiz.html?activity=quiz&selection=${encodeURIComponent(category.value)}#activitySelection`,
    status: "published"
  })),
  learning: learningResources.map(resource => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    image: "assets/images/learning/scripture-study.svg",
    category: resource.category,
    provider: resource.provider,
    destination: resource.url,
    status: "published"
  })),
  events,
  // These collections remain empty until approved, real records are supplied.
  results: [],
  activities: [],
  announcements: [],
  videos: [],
  featuredSaint: null,
  achievements: ACHIEVEMENT_TIERS
};

export const discoveryStories = [
  { id: "story-learn", title: "Learn", description: "Explore Catholic learning resources.", icon: "✧", href: "learn.html" },
  { id: "story-quiz", title: "Take a quiz", description: "Test your knowledge of the faith.", icon: "✦", href: "quiz.html#activitySelection" },
  { id: "story-games", title: "Play games", description: "Explore interactive faith activities.", icon: "◇", href: "#hot-games" },
  { id: "story-results", title: "Latest results", description: "See official results when published.", icon: "◈", href: "#latest-results" },
  { id: "story-challenge", title: "Daily challenge", description: "Take a short Scripture challenge.", icon: "✝", href: "#daily-challenge" },
  { id: "story-winners", title: "Top winners", description: "View the current demonstration preview.", icon: "🏆", href: "#top-winners" },
  { id: "story-saints", title: "Featured saint", description: "Explore reviewed saint features when available.", icon: "✧", href: "#featured-saint" },
  { id: "story-announcements", title: "Announcements", description: "Read official platform updates.", icon: "◎", href: "#announcements" }
];
