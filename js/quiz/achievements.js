/**
 * Achievement tiers are deliberately data-driven. Adjust thresholds, stars,
 * colours and messages here without changing result rendering code.
 */
export const ACHIEVEMENT_TIERS = [
  { id: "beginner", min: 0, max: 99, title: "Beginner", stars: 1, theme: "#8b9aa9", badge: "✦", message: "Every great journey begins with a first step. Thank you for taking part—keep learning and growing!", celebration: "gentle" },
  { id: "learner", min: 100, max: 299, title: "Learner", stars: 2, theme: "#6f9b83", badge: "✧", message: "You are building knowledge one challenge at a time. Celebrate your effort and keep moving forward!", celebration: "gentle" },
  { id: "rising-star", min: 300, max: 499, title: "Rising Star", stars: 3, theme: "#4b9aab", badge: "★", message: "Your progress is shining through. Well done for your commitment—your next achievement is within reach!", celebration: "stars" },
  { id: "achiever", min: 500, max: 799, title: "Achiever", stars: 4, theme: "#6688c2", badge: "✦", message: "Congratulations! Your effort has produced a strong performance. Keep aiming higher!", celebration: "confetti" },
  { id: "excellent", min: 800, max: 1000, title: "Excellent", stars: 5, theme: "#bd9347", badge: "🏅", message: "Excellent work! Your dedication and knowledge deserve to be celebrated. Keep shining!", celebration: "confetti" },
  { id: "outstanding", min: 1001, max: 2000, title: "Outstanding", stars: 6, theme: "#a77ac7", badge: "👑", message: "An outstanding achievement! You have delivered an exceptional performance. Congratulations!", celebration: "grand" },
  // Extendable example tier. Change the threshold when the scoring model grows.
  { id: "legend", min: 2001, max: Infinity, title: "Legendary", stars: 7, theme: "#d4a83f", badge: "♛", message: "A phenomenal result! Your dedication has reached a remarkable level. Keep inspiring others!", celebration: "grand" },
];

export function getAchievement(score, tiers = ACHIEVEMENT_TIERS) {
  const safeScore = Math.max(0, Number(score) || 0);
  return tiers.find(tier => safeScore >= tier.min && safeScore <= tier.max) || tiers[0];
}
