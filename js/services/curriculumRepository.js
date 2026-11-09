import { faithFormationAreas } from "../data/curriculumCatalog.js";
import { localLessons } from "../data/localLessons.js";

/** Read-only data boundary; a future API-backed repository can replace these lookups. */
export function getFaithAreas() {
  return faithFormationAreas.map(area => ({ ...area, topics: area.topics.map(topic => ({ ...topic, lessonIds: [...topic.lessonIds] })) }));
}

export function getFaithArea(areaId) {
  return getFaithAreas().find(area => area.id === areaId) || null;
}

export function getTopicsForArea(areaId) {
  return getFaithArea(areaId)?.topics || [];
}

export function getLessonsForTopic(topicId) {
  const topic = getFaithAreas().flatMap(area => area.topics).find(item => item.id === topicId);
  if (!topic) return [];
  return topic.lessonIds.map(id => localLessons.find(lesson => lesson.id === id)).filter(Boolean);
}

export function getLessonsForArea(areaId) {
  return getTopicsForArea(areaId).flatMap(topic => getLessonsForTopic(topic.id));
}
