/** Configurable speed-aware scoring shared by quiz and game attempts. */
export const SCORING = Object.freeze({
  questionSeconds: 7,
  baseCorrectPoints: 100,
  maximumSpeedBonus: 50,
});

/**
 * Correct answers earn base points plus a proportional time-remaining bonus.
 * Incorrect and unanswered questions always earn zero points.
 */
export function calculateQuestionScore({ correct, timeRemainingSeconds, totalSeconds = SCORING.questionSeconds }) {
  if (!correct) return 0;
  const safeTotal = Math.max(0.001, Number(totalSeconds) || SCORING.questionSeconds);
  const safeRemaining = Math.min(safeTotal, Math.max(0, Number(timeRemainingSeconds) || 0));
  const bonus = Math.round(SCORING.maximumSpeedBonus * (safeRemaining / safeTotal));
  return SCORING.baseCorrectPoints + bonus;
}
