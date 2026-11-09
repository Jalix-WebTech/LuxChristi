import assert from "node:assert/strict";
import { faithFormationAreas } from "../js/data/curriculumCatalog.js";
import { getFaithAreas, getFaithArea, getTopicsForArea, getLessonsForTopic, getLessonsForArea } from "../js/services/curriculumRepository.js";
import { localLessons } from "../js/data/localLessons.js";

assert.equal(faithFormationAreas.length, 2, "Only currently published Catholic learning areas should be exposed.");
assert.equal(getFaithAreas().length, 2);
assert.equal(getFaithArea("sacred-scripture")?.title, "Sacred Scripture");
assert.equal(getFaithArea("prayer-spiritual-life")?.title, "Prayer & Spiritual Life");
assert.equal(getFaithArea("general-education"), null, "General Education must not exist in the active catalogue.");
assert.equal(getTopicsForArea("sacred-scripture").length, 2);
assert.equal(getTopicsForArea("prayer-spiritual-life").length, 1);
assert.equal(getTopicsForArea("unknown-area").length, 0);
assert.equal(getLessonsForTopic("reading-scripture")[0]?.id, "reading-the-bible");
assert.equal(getLessonsForTopic("catholic-bible-structure")[0]?.id, "bible-library");
assert.equal(getLessonsForTopic("foundations-of-prayer")[0]?.id, "prayer-and-reflection");
assert.equal(getLessonsForArea("sacred-scripture").length, 2);
assert.equal(getLessonsForArea("prayer-spiritual-life").length, 1);

const linkedIds = getFaithAreas().flatMap(area => area.topics.flatMap(topic => topic.lessonIds));
assert.equal(new Set(linkedIds).size, linkedIds.length, "A lesson must not be linked more than once in the published starter map.");
assert.deepEqual(new Set(linkedIds), new Set(localLessons.map(lesson => lesson.id)), "Every local Catholic starter lesson must be reachable from the learning browser.");
console.log("PASS: Catholic-only learning areas, topics and lesson relationships are valid; General Education is excluded.");
