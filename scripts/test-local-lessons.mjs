import assert from "node:assert/strict";
import { localLessons } from "../js/data/localLessons.js";

assert.ok(localLessons.length >= 3, "At least three bundled starter lessons are required.");
const ids = new Set();
for (const lesson of localLessons) {
  assert.ok(lesson.id && !ids.has(lesson.id), `Lesson ID must be unique: ${lesson.id}`);
  ids.add(lesson.id);
  assert.ok(lesson.title && lesson.category && lesson.summary, `Lesson metadata is incomplete: ${lesson.id}`);
  assert.ok(lesson.objectives.length >= 2, `Lesson needs learning objectives: ${lesson.id}`);
  assert.ok(lesson.sections.length >= 2, `Lesson needs structured content: ${lesson.id}`);
  assert.ok(lesson.keyPoints.length >= 2, `Lesson needs key points: ${lesson.id}`);
  assert.ok(lesson.quiz.options.length >= 2, `Lesson needs a knowledge check: ${lesson.id}`);
  assert.ok(lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.options.length, `Lesson answer index is invalid: ${lesson.id}`);
  assert.ok(lesson.references.length > 0, `Lesson references are required: ${lesson.id}`);
}
console.log(`PASS: ${localLessons.length} locally hosted lessons have valid structure and knowledge checks.`);
