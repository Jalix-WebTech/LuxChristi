import { questionBanks } from "../question-banks/index.js";

/** Return a shuffled copy so the original question bank is never mutated. */
export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Collects questions from one category or every registered category.
 * The engine uses the actual bank length; it has no fixed category-size limit.
 */
export function getQuestions(category = "all") {
  if (category === "all") return Object.values(questionBanks).flat();
  return questionBanks[category] || [];
}

export function createQuiz(category = "all", requestedCount = 10) {
  const available = shuffle(getQuestions(category));
  const safeCount = Math.max(1, Math.min(Number(requestedCount) || 10, available.length));
  return available.slice(0, safeCount).map(question => ({
    ...question,
    answers: shuffle(question.answers),
  }));
}

export function isCorrect(question, selectedAnswer) {
  return question.correctAnswer === selectedAnswer;
}

export function getBankCounts() {
  return Object.fromEntries(Object.entries(questionBanks).map(([key, bank]) => [key, bank.length]));
}
