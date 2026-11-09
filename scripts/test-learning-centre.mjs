import assert from "node:assert/strict";
import { learningResources, learningCategories } from "../js/data/learningResources.js";

assert.ok(learningResources.length >= 10, "The learning catalogue should contain at least ten resources.");
const ids = new Set();
for (const resource of learningResources) {
  assert.ok(resource.id && !ids.has(resource.id), `Resource ID must be present and unique: ${resource.id}`);
  ids.add(resource.id);
  assert.ok(resource.title && resource.description && resource.provider, `Resource metadata is incomplete: ${resource.id}`);
  assert.ok(resource.url.startsWith("https://"), `Resource must use HTTPS: ${resource.id}`);
  assert.ok(resource.tags.length > 0, `Resource should have searchable tags: ${resource.id}`);
  assert.ok(learningCategories.some(category => category.id === resource.category), `Unknown category: ${resource.category}`);
}
assert.equal(learningCategories[0].id, "all", "The first category should represent the complete library.");
console.log(`PASS: ${learningResources.length} learning resources have valid metadata and category references.`);
