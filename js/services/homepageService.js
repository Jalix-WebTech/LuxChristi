import { homepageCatalogue, discoveryStories } from "../data/homepageData.js";
import { getTopWinners } from "./playerService.js";

/** Local MVP data adapter. Replace this module with API calls when a backend is approved. */
const clone = value => typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
const getCollection = key => Promise.resolve(clone(homepageCatalogue[key] || []));

export const homepageService = {
  getDiscoveryStories: () => Promise.resolve(clone(discoveryStories)),
  getGames: () => getCollection("games"),
  getTrendingQuizzes: () => getCollection("quizzes"),
  getLatestResults: () => getCollection("results"),
  getUpcomingEvents: () => getCollection("events"),
  getTopWinners,
  getCommunityActivities: () => getCollection("activities"),
  getLearningResources: () => getCollection("learning"),
  getAnnouncements: () => getCollection("announcements"),
  getFeaturedVideos: () => getCollection("videos"),
  getAchievementTiers: () => getCollection("achievements"),
  getFeaturedSaint: () => Promise.resolve(clone(homepageCatalogue.featuredSaint))
};
