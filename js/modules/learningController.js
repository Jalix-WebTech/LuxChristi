import { learningResources, learningCategories } from "../data/learningResources.js";
import { localLessons } from "../data/localLessons.js";
import { initCurriculumBrowser } from "./curriculumBrowserController.js";

const SAVED_KEY = "lux-learning-saved-v1";

function readSavedIds() {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    return new Set(Array.isArray(value) ? value.filter(id => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function saveIds(ids) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...ids]));
    return true;
  } catch (error) {
    console.warn("Learning bookmarks could not be saved.", error);
    return false;
  }
}

function createResourceCard(resource, savedIds) {
  const article = document.createElement("article");
  article.className = "learning-card";
  article.dataset.resourceId = resource.id;

  const top = document.createElement("div");
  top.className = "learning-card-topline";
  const type = document.createElement("span");
  type.className = "learning-type";
  type.textContent = resource.type;
  const saveButton = document.createElement("button");
  saveButton.className = "learning-save";
  saveButton.type = "button";
  saveButton.dataset.saveResource = resource.id;
  saveButton.setAttribute("aria-pressed", String(savedIds.has(resource.id)));
  saveButton.setAttribute("aria-label", `${savedIds.has(resource.id) ? "Remove saved resource" : "Save resource"}: ${resource.title}`);
  saveButton.textContent = savedIds.has(resource.id) ? "★ Saved" : "☆ Save";
  top.append(type, saveButton);

  const title = document.createElement("h3");
  title.textContent = resource.title;
  const description = document.createElement("p");
  description.textContent = resource.description;
  const provider = document.createElement("p");
  provider.className = "learning-provider";
  provider.textContent = `Source: ${resource.provider}`;

  const tagList = document.createElement("ul");
  tagList.className = "learning-tags";
  tagList.setAttribute("aria-label", "Resource topics");
  resource.tags.forEach(tag => {
    const item = document.createElement("li");
    item.textContent = tag;
    tagList.append(item);
  });

  const action = document.createElement("a");
  action.className = "button button-secondary learning-open";
  action.href = resource.url;
  action.target = "_blank";
  action.rel = "noopener noreferrer";
  action.textContent = "Open resource ↗";

  article.append(top, title, description, provider, tagList, action);
  return article;
}

const LESSON_PROGRESS_KEY = "lux-learning-progress-v1";

function readCompletedLessons() {
  try {
    const value = JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY) || "[]");
    return new Set(Array.isArray(value) ? value.filter(id => typeof id === "string") : []);
  } catch { return new Set(); }
}

function writeCompletedLessons(ids) {
  try { localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify([...ids])); return true; }
  catch (error) { console.warn("Lesson progress could not be saved.", error); return false; }
}

function makeTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function buildLessonNotes(lesson) {
  const lines = [lesson.title.toUpperCase(), `Category: ${lesson.category}`, `Level: ${lesson.level}`, `Estimated time: ${lesson.duration}`, "", lesson.summary, "", "LEARNING OBJECTIVES", ...lesson.objectives.map(item => `• ${item}`), ""];
  lesson.sections.forEach(section => {
    lines.push(section.heading.toUpperCase(), ...section.paragraphs, "");
  });
  lines.push("KEY POINTS", ...lesson.keyPoints.map(item => `• ${item}`), "", "REFLECTION", lesson.reflection, "", "REFERENCES", ...lesson.references.map(item => `• ${item}`), "", "Lux Christi — Light of Christ");
  return lines.join("\n");
}

function createLocalLessonCard(lesson, completed) {
  const card = document.createElement("article");
  card.className = "local-lesson-card";
  const top = document.createElement("div");
  top.className = "local-lesson-card-top";
  top.append(makeTextElement("span", "", lesson.category));
  if (completed.has(lesson.id)) top.append(makeTextElement("span", "lesson-complete-mark", "✓ Completed"));
  const title = makeTextElement("h3", "", lesson.title);
  const summary = makeTextElement("p", "", lesson.summary);
  const meta = document.createElement("div");
  meta.className = "lesson-meta";
  meta.append(makeTextElement("span", "", lesson.level), makeTextElement("span", "", lesson.duration));
  const open = makeTextElement("button", "button button-secondary", completed.has(lesson.id) ? "Review lesson" : "Start lesson →");
  open.type = "button";
  open.dataset.openLesson = lesson.id;
  card.append(top, title, summary, meta, open);
  return card;
}

function renderLesson(lesson, completed, onComplete) {
  const article = document.createElement("div");
  article.className = "lesson-article";
  const header = document.createElement("header");
  header.className = "lesson-article-header";
  header.append(makeTextElement("span", "eyebrow", `${lesson.category} · ${lesson.level} · ${lesson.duration}`));
  header.append(makeTextElement("h2", "", lesson.title));
  header.append(makeTextElement("p", "", lesson.summary));
  article.append(header);

  const objectives = document.createElement("section");
  objectives.className = "lesson-objectives";
  objectives.append(makeTextElement("h3", "", "What you will learn"));
  const objectiveList = document.createElement("ul");
  lesson.objectives.forEach(item => objectiveList.append(makeTextElement("li", "", item)));
  objectives.append(objectiveList);
  article.append(objectives);

  lesson.sections.forEach(section => {
    const block = document.createElement("section");
    block.append(makeTextElement("h3", "", section.heading));
    section.paragraphs.forEach(paragraph => block.append(makeTextElement("p", "", paragraph)));
    article.append(block);
  });

  const keyPoints = document.createElement("section");
  keyPoints.className = "lesson-key-points";
  keyPoints.append(makeTextElement("h3", "", "Key points to remember"));
  const keyList = document.createElement("ul");
  lesson.keyPoints.forEach(item => keyList.append(makeTextElement("li", "", item)));
  keyPoints.append(keyList);
  article.append(keyPoints);

  const reflection = document.createElement("section");
  reflection.className = "lesson-reflection";
  reflection.append(makeTextElement("h3", "", "Think and reflect"), makeTextElement("p", "", lesson.reflection));
  article.append(reflection);

  const check = document.createElement("section");
  check.className = "lesson-knowledge-check";
  check.append(makeTextElement("h3", "", "Quick knowledge check"));
  const fieldset = document.createElement("fieldset");
  fieldset.append(makeTextElement("legend", "", lesson.quiz.question));
  lesson.quiz.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "lesson-answer";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `lesson-answer-${lesson.id}`;
    input.value = String(index);
    label.append(input, makeTextElement("span", "", option));
    fieldset.append(label);
  });
  const checkButton = makeTextElement("button", "button button-secondary", "Check answer");
  checkButton.type = "button";
  const feedback = makeTextElement("p", "lesson-check-feedback", "");
  feedback.setAttribute("aria-live", "polite");
  checkButton.addEventListener("click", () => {
    const selected = fieldset.querySelector("input:checked");
    if (!selected) { feedback.textContent = "Choose an answer first."; return; }
    const correct = Number(selected.value) === lesson.quiz.answer;
    feedback.textContent = `${correct ? "Correct. " : "Not quite. "}${lesson.quiz.explanation}`;
  });
  check.append(fieldset, checkButton, feedback);
  article.append(check);

  const references = document.createElement("section");
  references.className = "lesson-references";
  references.append(makeTextElement("h3", "", "Further reading and references"));
  const referenceList = document.createElement("ul");
  referenceList.className = "lesson-reference-list";
  lesson.references.forEach(item => referenceList.append(makeTextElement("li", "", item)));
  references.append(referenceList);
  article.append(references);

  const actions = document.createElement("div");
  actions.className = "lesson-actions";
  const download = makeTextElement("button", "button button-secondary", "↓ Download study notes");
  download.type = "button";
  download.addEventListener("click", () => {
    const blob = new Blob([buildLessonNotes(lesson)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${lesson.id}-lux-christi-notes.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  });
  const complete = makeTextElement("button", "button button-primary", completed.has(lesson.id) ? "✓ Lesson completed" : "Mark lesson as complete");
  complete.type = "button";
  complete.disabled = completed.has(lesson.id);
  complete.addEventListener("click", () => onComplete(lesson.id));
  actions.append(download, complete);
  article.append(actions);
  return article;
}

export function initLearningCentre() {
  const grid = document.querySelector("#learningResourceGrid");
  if (!grid) return;

  const searchInput = document.querySelector("#resourceSearch");
  const categorySelect = document.querySelector("#resourceCategory");
  const savedOnly = document.querySelector("#savedResourcesOnly");
  const count = document.querySelector("#resourceCount");
  const empty = document.querySelector("#resourceEmptyState");
  const status = document.querySelector("#resourceStatus");
  const clearButton = document.querySelector("#clearResourceFilters");
  const emptyClearButton = document.querySelector("#emptyClearButton");
  const categoryButtons = document.querySelector("#resourceCategoryButtons");

  let savedIds = readSavedIds();
  let activeCategory = "all";
  let showSavedOnly = false;
  const lessonGrid = document.querySelector("#localLessonGrid");
  const lessonReader = document.querySelector("#lessonReader");
  const lessonContent = document.querySelector("#lessonContent");
  const closeLessonButton = document.querySelector("#closeLesson");
  const progressText = document.querySelector("#lessonProgressText");
  const progressPercent = document.querySelector("#lessonProgressPercent");
  const progressBar = document.querySelector("#lessonProgressBar");
  let completedLessons = readCompletedLessons();

  function renderLocalLessons(selectedLessonIds = null) {
    const visibleLessons = selectedLessonIds === null
      ? localLessons
      : localLessons.filter(lesson => selectedLessonIds.includes(lesson.id));
    lessonGrid?.replaceChildren(...visibleLessons.map(lesson => createLocalLessonCard(lesson, completedLessons)));
    if (lessonGrid && visibleLessons.length === 0) {
      const empty = makeTextElement("p", "curriculum-empty-state", "There are no published local lessons in this selection yet.");
      lessonGrid.append(empty);
    }
    const total = localLessons.length;
    const completed = localLessons.filter(lesson => completedLessons.has(lesson.id)).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    if (progressText) progressText.textContent = `${completed} of ${total} lessons completed`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
  }

  function closeLesson() {
    if (lessonReader) lessonReader.hidden = true;
    document.querySelector(".local-learning")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  lessonGrid?.addEventListener("click", event => {
    const button = event.target.closest("[data-open-lesson]");
    if (!button) return;
    const lesson = localLessons.find(item => item.id === button.dataset.openLesson);
    if (!lesson || !lessonReader || !lessonContent) return;
    lessonContent.replaceChildren(renderLesson(lesson, completedLessons, id => {
      completedLessons.add(id);
      const saved = writeCompletedLessons(completedLessons);
      renderLocalLessons();
      lessonContent.replaceChildren(renderLesson(lesson, completedLessons, () => {}));
      if (status) status.textContent = saved ? "Lesson marked as complete." : "Progress could not be saved in this browser.";
    }));
    lessonReader.hidden = false;
    lessonReader.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  closeLessonButton?.addEventListener("click", closeLesson);
  renderLocalLessons();
  initCurriculumBrowser((lessonIds, label) => {
    const collectionHeading = document.querySelector("#lessonCollectionHeading");
    if (collectionHeading) collectionHeading.textContent = label;
    renderLocalLessons(lessonIds);
  });

  learningCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    categorySelect?.append(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "resource-filter-chip";
    button.dataset.category = category.id;
    button.textContent = category.label;
    button.setAttribute("aria-pressed", String(category.id === activeCategory));
    categoryButtons?.append(button);
  });

  function render() {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase();
    const filtered = learningResources.filter(resource => {
      const categoryMatches = activeCategory === "all" || resource.category === activeCategory;
      const savedMatches = !showSavedOnly || savedIds.has(resource.id);
      const searchable = [resource.title, resource.description, resource.provider, resource.type, ...resource.tags]
        .join(" ").toLocaleLowerCase();
      return categoryMatches && savedMatches && searchable.includes(query);
    });

    grid.replaceChildren(...filtered.map(resource => createResourceCard(resource, savedIds)));
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? "resource" : "resources"} found`;
    if (empty) empty.hidden = filtered.length > 0;
    if (status) status.textContent = `${filtered.length} ${filtered.length === 1 ? "resource" : "resources"} shown.`;
    if (categorySelect) categorySelect.value = activeCategory;
    if (savedOnly) {
      savedOnly.setAttribute("aria-pressed", String(showSavedOnly));
      savedOnly.textContent = showSavedOnly ? "★ Showing saved" : "☆ Saved resources";
    }
    categoryButtons?.querySelectorAll("[data-category]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.category === activeCategory));
    });
  }

  searchInput?.addEventListener("input", render);
  categorySelect?.addEventListener("change", () => {
    activeCategory = categorySelect.value;
    render();
  });
  categoryButtons?.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    render();
  });
  savedOnly?.addEventListener("click", () => {
    showSavedOnly = !showSavedOnly;
    render();
  });
  const clearFilters = () => {
    if (searchInput) searchInput.value = "";
    activeCategory = "all";
    showSavedOnly = false;
    render();
    searchInput?.focus();
  };
  clearButton?.addEventListener("click", clearFilters);
  emptyClearButton?.addEventListener("click", clearFilters);
  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-save-resource]");
    if (!button) return;
    const id = button.dataset.saveResource;
    if (savedIds.has(id)) savedIds.delete(id);
    else savedIds.add(id);
    const saved = saveIds(savedIds);
    render();
    if (status) status.textContent = saved ? "Your saved resources have been updated." : "This browser could not save your bookmark. Check storage settings.";
  });

  render();
}
