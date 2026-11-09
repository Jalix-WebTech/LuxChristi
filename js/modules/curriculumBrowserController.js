import { getFaithAreas, getFaithArea, getTopicsForArea } from "../services/curriculumRepository.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function makeCard(title, description, actionLabel, attribute, id, statusText = "") {
  const card = element("article", "curriculum-card");
  card.append(element("h3", "", title), element("p", "", description));
  if (statusText) card.append(element("span", "curriculum-card-status", statusText));
  const button = element("button", "button button-secondary", actionLabel);
  button.type = "button";
  button.dataset[attribute] = id;
  card.append(button);
  return card;
}

/** Faith area → topic → published lesson navigation. */
export function initCurriculumBrowser(onLessonSelection) {
  const navigation = document.querySelector("#curriculumNavigation");
  const breadcrumbs = document.querySelector("#curriculumBreadcrumbs");
  const message = document.querySelector("#curriculumMessage");
  const heading = document.querySelector("#lessonCollectionHeading");
  const browseButton = document.querySelector("#showAllLessons");
  const backButton = document.querySelector("#curriculumBackButton");
  if (!navigation) return;

  let backAction = null;
  const announce = text => { if (message) message.textContent = text; };
  const setBreadcrumb = parts => { if (breadcrumbs) breadcrumbs.textContent = parts.join("  /  "); };
  const setBack = (label, action = null) => {
    backAction = action;
    if (backButton) { backButton.textContent = label; backButton.hidden = !action; }
  };

  function showAllLessons() {
    if (heading) heading.textContent = "All published Catholic faith-formation lessons";
    onLessonSelection(null, "All published Catholic faith-formation lessons");
  }

  function renderAreas() {
    setBack("← Back", null);
    setBreadcrumb(["Learning Centre", "Catholic Faith Formation"]);
    announce("Choose a published Catholic learning area to explore its topics and lessons.");
    navigation.replaceChildren(...getFaithAreas().map(area => makeCard(
      area.title, area.description, "Explore topics", "faithArea", area.id,
      `${area.topics.length} ${area.topics.length === 1 ? "topic" : "topics"}`
    )));
    showAllLessons();
  }

  function renderTopics(area) {
    setBack("← Learning areas", renderAreas);
    setBreadcrumb(["Learning Centre", "Catholic Faith Formation", area.title]);
    announce(`Explore the published topics in ${area.title}.`);
    navigation.replaceChildren(...area.topics.map(topic => makeCard(
      topic.title, topic.summary, "View lessons", "faithTopic", topic.id,
      `${topic.lessonIds.length} ${topic.lessonIds.length === 1 ? "lesson" : "lessons"}`
    )));
    if (heading) heading.textContent = `${area.title} lessons`;
    onLessonSelection(area.topics.flatMap(topic => topic.lessonIds), `${area.title} lessons`);
  }

  function renderTopic(topicId) {
    const area = getFaithAreas().find(item => item.topics.some(topic => topic.id === topicId));
    const topic = area?.topics.find(item => item.id === topicId);
    if (!area || !topic) return;
    setBack("← Topics", () => renderTopics(getFaithArea(area.id)));
    setBreadcrumb(["Learning Centre", "Catholic Faith Formation", area.title, topic.title]);
    announce(`Showing published lessons for ${topic.title}.`);
    if (heading) heading.textContent = topic.title;
    onLessonSelection(topic.lessonIds, topic.title);
  }

  navigation.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.faithArea) {
      const area = getFaithArea(button.dataset.faithArea);
      if (area) renderTopics(area);
    } else if (button.dataset.faithTopic) {
      renderTopic(button.dataset.faithTopic);
    }
  });

  backButton?.addEventListener("click", () => backAction?.());
  browseButton?.addEventListener("click", renderAreas);
  renderAreas();
}
