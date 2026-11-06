import { createQuiz, isCorrect, shuffle } from "./quiz-engine.js";
import { validatePlayerName } from "./quiz-validation.js";
import { downloadActivityResult } from "./quiz-results.js";
import { getAchievement } from "./achievements.js";
import { SCORING, calculateQuestionScore } from "./scoring.js";
import { categoryOptions } from "../question-banks/index.js";
import { games } from "../games/index.js";
import { requestConfirmation } from "../components/confirmationDialog.js";

// Central configuration keeps timing and scoring consistent in both activity modes.
const QUESTION_SECONDS = SCORING.questionSeconds;
const QUIZ_QUESTION_LIMIT = 10;
const FEEDBACK_DELAY_MS = 950;

const $ = (selector, scope = document) => scope.querySelector(selector);
const state = {
  activity: "",
  selection: "",
  player: "",
  questions: [],
  index: 0,
  score: 0,
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  responseTimes: [],
  correctResponseTimes: [],
  locked: false,
  deadline: 0,
  questionStartedAt: 0,
  timer: null,
  advanceTimer: null,
  countdownTimer: null,
  countdownTransitionTimer: null,
  photo: null,
  photoImage: null,
  photoCrop: { zoom: 1, offsetX: 0, offsetY: 0 },
  previewRequest: 0,
  sessionActive: false,
  registrationActive: false,
  exitConfirmed: false,
  historyGuardArmed: false,
  integrityEvents: 0,
  lastIntegrityAt: 0,
  focusWarningTimer: null,
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function selectedLabel() {
  if (state.activity === "quiz") {
    return categoryOptions.find(item => item.value === state.selection)?.label || "All Categories";
  }
  return games.find(game => game.id === state.selection)?.title || "Catholic Games";
}

function clearTimer() {
  if (state.timer) window.clearInterval(state.timer);
  state.timer = null;
}

function clearAdvanceTimer() {
  if (state.advanceTimer) window.clearTimeout(state.advanceTimer);
  state.advanceTimer = null;
}

function clearCountdown() {
  if (state.countdownTimer) window.clearInterval(state.countdownTimer);
  if (state.countdownTransitionTimer) window.clearTimeout(state.countdownTransitionTimer);
  state.countdownTimer = null;
  state.countdownTransitionTimer = null;
}

function setFlowStep(step) {
  document.querySelectorAll("[data-flow-step]").forEach(panel => {
    panel.hidden = Number(panel.dataset.flowStep) !== step;
  });
  document.querySelectorAll("[data-flow-indicator]").forEach(indicator => {
    const number = Number(indicator.dataset.flowIndicator);
    indicator.classList.toggle("is-current", number === step);
    indicator.classList.toggle("is-complete", number < step);
  });
  $("#countdownScreen").hidden = true;
  $("#activitySession").hidden = true;
  $("#activityResults").hidden = true;
}

function resetAttemptStats() {
  clearTimer();
  clearAdvanceTimer();
  state.index = 0;
  state.score = 0;
  state.correct = 0;
  state.incorrect = 0;
  state.unanswered = 0;
  state.responseTimes = [];
  state.correctResponseTimes = [];
  state.locked = false;
  state.photo = null;
  state.photoImage = null;
  state.photoCrop = { zoom: 1, offsetX: 0, offsetY: 0 };
  state.integrityEvents = 0;
  state.lastIntegrityAt = 0;
}

function renderSelectionOptions() {
  const grid = $("#selectionGrid");
  const isQuiz = state.activity === "quiz";
  $("#selectionStepTitle").textContent = isQuiz ? "Pick your category." : "Choose your game.";
  $("#selectionStepDescription").textContent = isQuiz
    ? "Choose the subject you would like to explore."
    : "Select the game challenge you would like to play.";

  const options = isQuiz
    ? categoryOptions.map(category => ({ id: category.value, title: category.label, description: category.value === "all" ? "A mixed selection drawn from every available subject." : categoryDescription(category.value), icon: category.value === "all" ? "✦" : categoryIcon(category.value) }))
    : games.map(game => ({ id: game.id, title: game.title, description: game.description, icon: game.icon }));

  const selectionStep = $("#selectionStep");
  selectionStep.dataset.activityType = isQuiz ? "quiz" : "games";
  grid.innerHTML = options.map(option => `
    <button class="selection-card" type="button" data-selection="${escapeHTML(option.id)}" aria-pressed="false">
      <span class="selection-card-icon" aria-hidden="true">${escapeHTML(option.icon)}</span>
      <span class="selection-card-copy"><strong>${escapeHTML(option.title)}</strong><small>${escapeHTML(option.description)}</small></span>
      <span class="selection-card-check" aria-hidden="true">✓</span>
    </button>`).join("");

  grid.querySelectorAll("[data-selection]").forEach(button => {
    button.addEventListener("click", () => {
      state.selection = button.dataset.selection;
      grid.querySelectorAll("[data-selection]").forEach(card => {
        const selected = card === button;
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", String(selected));
      });
      $("#selectionNext").disabled = false;
      $("#selectionError").textContent = "";
    });
  });
  state.selection = "";
  $("#selectionNext").disabled = true;
  $("#selectionError").textContent = "";
}

function categoryDescription(id) {
  const descriptions = {
    "bible-knowledge": "Explore people, places, events and teachings in Scripture.",
    "catholic-doctrine": "Discover the beliefs and teachings of the Catholic Church.",
    "saints-and-virtues": "Learn about holy men and women and the virtues they lived.",
    riddles: "Solve faith-inspired riddles and test your reasoning.",
    "picture-quiz": "Identify Catholic subjects through visual clues.",
    "legion-of-mary": "Explore the Legion of Mary and its spirituality.",
    "sacred-heart": "Reflect on devotion to the Sacred Heart of Jesus.",
    "st-anthony": "Discover the life and devotion associated with St. Anthony.",
    "other-devotions": "Explore Catholic devotions and pious societies.",
  };
  return descriptions[id] || "Explore this area of Catholic knowledge.";
}

function categoryIcon(id) {
  const icons = {
    "bible-knowledge": "▤", "catholic-doctrine": "✝", "saints-and-virtues": "✧",
    riddles: "?", "picture-quiz": "▧", "legion-of-mary": "♙", "sacred-heart": "♡",
    "st-anthony": "✦", "other-devotions": "◇",
  };
  return icons[id] || "✦";
}

function showCountdown() {
  clearCountdown();
  state.registrationActive = false;
  setFlowStep(0);
  $(".flow-progress").hidden = true;
  $("#countdownScreen").hidden = false;
  const number = $("#countdownNumber");
  let remaining = 5;
  number.textContent = String(remaining);
  number.classList.remove("countdown-pop");
  void number.offsetWidth;
  number.classList.add("countdown-pop");

  state.countdownTimer = window.setInterval(() => {
    remaining -= 1;
    number.textContent = String(remaining);
    number.classList.remove("countdown-pop");
    void number.offsetWidth;
    number.classList.add("countdown-pop");
    if (remaining <= 0) {
      clearCountdown();
      state.countdownTransitionTimer = window.setTimeout(() => {
        state.countdownTransitionTimer = null;
        beginActivity();
      }, 450);
    }
  }, 1000);
}

function prepareQuestions() {
  if (state.activity === "quiz") return createQuiz(state.selection, QUIZ_QUESTION_LIMIT);
  const game = games.find(item => item.id === state.selection);
  if (!game) return [];
  return game.rounds.map(round => ({ ...round, answers: shuffle(round.answers) }));
}

function beginActivity() {
  resetAttemptStats();
  state.questions = prepareQuestions();
  if (!state.questions.length) {
    $("#countdownScreen").hidden = true;
    setFlowStep(2);
    $("#selectionError").textContent = "This activity is not available yet. Please choose another option.";
    return;
  }

  $(".flow-progress").hidden = true;
  $("#countdownScreen").hidden = true;
  $("#activitySession").hidden = false;
  $("#sessionPlayer").textContent = state.player;
  $("#sessionActivity").textContent = selectedLabel();
  $("#sessionScore").textContent = "0";
  $("#integrityWarning").hidden = true;
  state.sessionActive = true;
  armHistoryGuard();
  renderQuestion();
  $("#activitySession").scrollIntoView({ behavior: "smooth", block: "start" });
}

function currentQuestion() {
  return state.questions[state.index];
}

function renderQuestion() {
  if (state.index >= state.questions.length) {
    renderResults();
    return;
  }

  state.locked = false;
  const question = currentQuestion();
  const playArea = $("#sessionPlayArea");
  const isPicture = question.type === "picture";
  const pictureMarkup = isPicture ? `
    <figure class="picture-question">
      <img src="${escapeHTML(question.image)}" data-fallback="${escapeHTML(question.imageFallback || "")}" alt="${escapeHTML(question.imageAlt || "Picture clue")}" loading="eager">
      <figcaption hidden>Image unavailable. Please check your connection or the picture asset.</figcaption>
      <a class="image-credit" href="${escapeHTML(question.imageCredit || "https://commons.wikimedia.org/")}" target="_blank" rel="noopener noreferrer">Image source and licence ↗</a>
    </figure>` : "";

  playArea.classList.add("is-protected");
  playArea.dataset.activityType = state.activity;
  playArea.innerHTML = `
    <div class="question-meta-row"><span class="eyebrow">${state.activity === "quiz" ? "KNOWLEDGE QUIZ" : "CATHOLIC GAME"}</span><span class="question-number">QUESTION ${state.index + 1}</span></div>
    <div class="question-timer-row"><span class="timer-label">TIME REMAINING</span><strong class="question-timer" id="timerCount">${QUESTION_SECONDS}s</strong></div>
    <div class="question-timer-track" role="progressbar" aria-label="Question time remaining" aria-valuemin="0" aria-valuemax="${QUESTION_SECONDS}" aria-valuenow="${QUESTION_SECONDS}"><span id="timerFill"></span></div>
    <p class="question-topic">${escapeHTML(question.category || selectedLabel())}</p>
    ${pictureMarkup}
    <h2 class="active-question-title">${escapeHTML(question.question)}</h2>
    <div class="active-answer-grid">${question.answers.map((answer, index) => `
      <button class="active-answer" type="button" data-answer-index="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(answer)}</span></button>`).join("")}</div>
    <div class="question-feedback" id="questionFeedback" role="status" aria-live="polite"></div>`;

  const image = $(".picture-question img", playArea);
  if (image) {
    image.addEventListener("error", () => {
      if (image.dataset.fallback && !image.dataset.fallbackTried) {
        image.dataset.fallbackTried = "true";
        image.src = image.dataset.fallback;
      } else {
        image.hidden = true;
        image.nextElementSibling.hidden = false;
      }
    });
  }

  playArea.querySelectorAll("[data-answer-index]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.locked) return;
      const selected = question.answers[Number(button.dataset.answerIndex)];
      submitAnswer(selected, false);
    });
  });

  startQuestionTimer();
}

function startQuestionTimer() {
  clearTimer();
  state.questionStartedAt = performance.now();
  state.deadline = state.questionStartedAt + QUESTION_SECONDS * 1000;
  const update = () => {
    const remainingMs = Math.max(0, state.deadline - performance.now());
    const seconds = Math.ceil(remainingMs / 1000);
    const count = $("#timerCount");
    const fill = $("#timerFill");
    const track = $(".question-timer-track");
    if (count) count.textContent = `${seconds}s`;
    if (fill) {
      fill.style.width = `${(remainingMs / (QUESTION_SECONDS * 1000)) * 100}%`;
      fill.classList.toggle("is-urgent", seconds <= 3);
    }
    if (track) track.setAttribute("aria-valuenow", String(seconds));
    if (remainingMs <= 0) {
      clearTimer();
      if (!state.locked) submitAnswer(null, true);
    }
  };
  update();
  state.timer = window.setInterval(update, 50);
}

function submitAnswer(selectedAnswer, timedOut) {
  if (state.locked) return;
  state.locked = true;
  clearTimer();

  const question = currentQuestion();
  const elapsedRaw = Math.max(0, (performance.now() - state.questionStartedAt) / 1000);
  const elapsedSeconds = Math.min(QUESTION_SECONDS, elapsedRaw);
  const expired = timedOut || elapsedRaw >= QUESTION_SECONDS;
  const remainingSeconds = Math.max(0, QUESTION_SECONDS - elapsedSeconds);
  state.responseTimes.push(elapsedSeconds);

  const correct = !expired && isCorrect(question, selectedAnswer);
  if (correct) {
    state.correct += 1;
    state.correctResponseTimes.push(elapsedSeconds);
    state.score += calculateQuestionScore({ correct: true, timeRemainingSeconds: remainingSeconds });
  } else if (expired) {
    state.unanswered += 1;
  } else {
    state.incorrect += 1;
  }

  const answerButtons = $("#sessionPlayArea").querySelectorAll("[data-answer-index]");
  answerButtons.forEach(button => {
    const answer = question.answers[Number(button.dataset.answerIndex)];
    button.disabled = true;
    if (answer === question.correctAnswer) button.classList.add("is-correct");
    else if (!expired && answer === selectedAnswer) button.classList.add("is-wrong");
  });

  const feedback = $("#questionFeedback");
  if (expired) {
    feedback.textContent = `Time is up. The correct answer is ${question.correctAnswer}. ${question.explanation}`;
    feedback.className = "question-feedback is-warning";
  } else if (correct) {
    const awarded = calculateQuestionScore({ correct: true, timeRemainingSeconds: remainingSeconds });
    feedback.textContent = `Correct! +${awarded} points. ${question.explanation}`;
    feedback.className = "question-feedback is-success";
  } else {
    feedback.textContent = `Not quite. The correct answer is ${question.correctAnswer}. ${question.explanation}`;
    feedback.className = "question-feedback is-warning";
  }
  $("#sessionScore").textContent = String(state.score);

  // Auto-advance after a short feedback pause; no manual next-question control is exposed.
  state.advanceTimer = window.setTimeout(() => {
    state.index += 1;
    renderQuestion();
  }, FEEDBACK_DELAY_MS);
}

function renderResults() {
  clearTimer();
  clearAdvanceTimer();
  state.sessionActive = false;
  state.registrationActive = false;
  $("#activitySession").hidden = true;
  $("#activityResults").hidden = false;
  const total = state.questions.length;
  const maxScore = total * (SCORING.baseCorrectPoints + SCORING.maximumSpeedBonus);
  const average = state.responseTimes.length
    ? state.responseTimes.reduce((sum, value) => sum + value, 0) / state.responseTimes.length
    : 0;
  const accuracy = Math.round((state.correct / Math.max(total, 1)) * 100);
  const correctAverage = state.correctResponseTimes.length
    ? state.correctResponseTimes.reduce((sum, value) => sum + value, 0) / state.correctResponseTimes.length
    : 0;
  const speedLabel = state.correct === 0 ? "No correct responses yet" : correctAverage <= 2 ? "Very quick" : correctAverage <= 4 ? "Good pace" : "Keep practising your speed";
  const achievement = getAchievement(state.score);
  const completionDate = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const encouragement = achievement.message;

  // Each result is a fresh data snapshot. Player-entered community details and
  // the selected photo are optional and are never used to alter the score.
  const resultDetails = () => ({
    name: state.player,
    score: state.score,
    maxScore,
    accuracy,
    correct: state.correct,
    incorrect: state.incorrect,
    unanswered: state.unanswered,
    activity: state.activity === "quiz" ? "KNOWLEDGE QUIZ" : "CATHOLIC GAME",
    selection: selectedLabel(),
    achievement,
    photoImage: state.photoImage,
    photoCrop: { ...state.photoCrop },
    diocese: $("#resultDiocese")?.value.trim() || "",
    deanery: $("#resultDeanery")?.value.trim() || "",
    parish: $("#resultParish")?.value.trim() || "",
    averageResponseSeconds: average,
    completionDate,
  });

  $("#activityResults").dataset.activityType = state.activity;
  $("#activityResults").innerHTML = `
    <div class="result-panel achievement-${escapeHTML(achievement.id)}">
      <div class="achievement-reveal"><span class="eyebrow">ACTIVITY COMPLETE · ${escapeHTML(achievement.title.toUpperCase())}</span><div class="achievement-emblem" aria-hidden="true">${escapeHTML(achievement.badge)}</div></div>
      <h2 id="resultTitle">${state.score >= 800 ? "Outstanding work" : state.score >= 300 ? "Well done" : "Thank you for taking part"}, ${escapeHTML(state.player)}!</h2>
      <p class="result-context">${escapeHTML(state.activity === "quiz" ? "Knowledge Quiz" : "Catholic Game")} · ${escapeHTML(selectedLabel())}</p>
      <div class="result-achievement-summary"><strong>${escapeHTML(achievement.title)}</strong><span class="achievement-stars" aria-label="${achievement.stars} star rating">${"★".repeat(achievement.stars)}${"☆".repeat(Math.max(0, 7 - achievement.stars))}</span><p>${escapeHTML(encouragement)}</p></div>
      <div class="result-score-wrap"><strong>${state.score.toLocaleString()}</strong><span>POINTS <small>out of ${maxScore.toLocaleString()} possible</small></span></div>
      <div class="result-stat-grid">
        <div><strong>${state.correct}</strong><span>Correct</span></div>
        <div><strong>${state.incorrect}</strong><span>Incorrect</span></div>
        <div><strong>${state.unanswered}</strong><span>Unanswered</span></div>
        <div><strong>${average.toFixed(1)}s</strong><span>Average response</span></div>
      </div>
      <div class="result-performance"><span>Accuracy</span><strong>${accuracy}%</strong><div class="result-meter"><span style="width:${accuracy}%"></span></div><p>Speed performance: <strong>${speedLabel}</strong></p></div>

      <section class="result-personalization" aria-labelledby="resultPersonalizationTitle">
        <div class="result-editor-heading"><span class="eyebrow">MAKE IT YOURS</span><h3 id="resultPersonalizationTitle">Personalize your result card</h3><p>Your score and achievement are fixed. Add your photo and community details before downloading.</p></div>
        <div class="result-editor-grid">
          <div class="photo-editor">
            <label class="button button-light photo-picker" for="resultPhoto">Add Photo</label>
            <input id="resultPhoto" type="file" accept="image/jpeg,image/png,image/webp" hidden>
            <div class="photo-adjust-controls" id="photoAdjustControls" hidden>
              <label for="photoZoom">Zoom <input id="photoZoom" type="range" min="1" max="3" step="0.05" value="1"></label>
              <button class="button button-light" id="resetPhoto" type="button">Reset photo</button>
              <small>Drag the photo inside its circular frame to reposition it.</small>
            </div>
          </div>
          <div class="community-fields">
            <label for="resultDiocese">Diocese <input id="resultDiocese" type="text" maxlength="80" placeholder="Enter your diocese"></label>
            <label for="resultDeanery">Deanery <input id="resultDeanery" type="text" maxlength="80" placeholder="Enter your deanery"></label>
            <label for="resultParish">Parish <input id="resultParish" type="text" maxlength="80" placeholder="Enter your parish"></label>
          </div>
        </div>
        <div class="result-preview-wrap"><div class="result-preview-heading"><strong>Live result preview</strong><span>Updates automatically</span></div><canvas id="resultCardPreview" width="1200" height="1500" aria-label="Preview of your flattened Lux Christi result card"></canvas></div>
      </section>

      <div class="result-actions">
        <button class="button button-gold" id="downloadResult" type="button">Download JPG result card</button>
        <button class="button button-dark" id="playAgain" type="button">Play again</button>
        <button class="text-button" id="chooseAnother" type="button">Choose another activity</button>
      </div>
      <p class="result-message" id="resultMessage" role="status">Your result is ready. Add a photo and community details, then download your JPG.</p>
      <p class="result-integrity-note">Integrity events recorded during this attempt: ${state.integrityEvents}. This is a locally generated practice result, not an official competition record.</p>
    </div>`;

  const preview = $("#resultCardPreview");
  const updatePreview = async () => {
    const requestId = ++state.previewRequest;
    try {
      const details = resultDetails();
      // Avoid older asynchronous image renders replacing a newer edit.
      const rendered = await import("../services/resultService.js").then(module => module.renderResultCanvas(details));
      if (requestId !== state.previewRequest) return;
      preview.width = rendered.width;
      preview.height = rendered.height;
      preview.getContext("2d").drawImage(rendered, 0, 0);
    } catch (error) {
      console.error("Result preview update failed:", error);
    }
  };
  const communityInputs = ["#resultDiocese", "#resultDeanery", "#resultParish"];
  communityInputs.forEach(selector => $(selector).addEventListener("input", updatePreview));
  updatePreview();

  $("#resultPhoto").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      $("#resultMessage").textContent = "Please choose a JPG, PNG or WebP image.";
      event.target.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      $("#resultMessage").textContent = "That image is larger than 8 MB. Please choose a smaller photo.";
      event.target.value = "";
      return;
    }
    try {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(imageUrl);
        if (image.width > 6000 || image.height > 6000) {
          $("#resultMessage").textContent = "This image has very large dimensions. Please choose a smaller photo.";
          return;
        }
        state.photo = file;
        state.photoImage = image;
        state.photoCrop = { zoom: 1, offsetX: 0, offsetY: 0 };
        $("#photoAdjustControls").hidden = false;
        $("#photoZoom").value = "1";
        $("#resultMessage").textContent = "Photo added. Drag the preview to reposition it or adjust the zoom.";
        updatePreview();
      };
      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        $("#resultMessage").textContent = "We could not read that image. Please try another file.";
      };
      image.src = imageUrl;
    } catch (error) {
      $("#resultMessage").textContent = "We could not load that photo. Please try another image.";
    }
  });

  $("#photoZoom").addEventListener("input", event => {
    state.photoCrop.zoom = Number(event.target.value);
    updatePreview();
  });
  $("#resetPhoto").addEventListener("click", () => {
    state.photoCrop = { zoom: 1, offsetX: 0, offsetY: 0 };
    $("#photoZoom").value = "1";
    updatePreview();
  });

  // Pointer drag adjusts the crop in canvas coordinates while preserving aspect ratio.
  let dragStart = null;
  preview.addEventListener("pointerdown", event => {
    if (!state.photoImage) return;
    const bounds = preview.getBoundingClientRect();
    const canvasX = (event.clientX - bounds.left) * (preview.width / bounds.width);
    const canvasY = (event.clientY - bounds.top) * (preview.height / bounds.height);
    if (Math.hypot(canvasX - 600, canvasY - 510) > 145) return;
    preview.setPointerCapture(event.pointerId);
    dragStart = { x: event.clientX, y: event.clientY, offsetX: state.photoCrop.offsetX, offsetY: state.photoCrop.offsetY, scaleX: preview.width / bounds.width, scaleY: preview.height / bounds.height };
  });
  preview.addEventListener("pointermove", event => {
    if (!dragStart) return;
    state.photoCrop.offsetX = dragStart.offsetX + (event.clientX - dragStart.x) * dragStart.scaleX;
    state.photoCrop.offsetY = dragStart.offsetY + (event.clientY - dragStart.y) * dragStart.scaleY;
    // Keep the circular crop fully covered by the uploaded image.
    const image = state.photoImage;
    const scale = Math.max(250 / image.width, 250 / image.height) * state.photoCrop.zoom;
    const maxX = Math.max(0, (image.width * scale - 250) / 2);
    const maxY = Math.max(0, (image.height * scale - 250) / 2);
    state.photoCrop.offsetX = Math.max(-maxX, Math.min(maxX, state.photoCrop.offsetX));
    state.photoCrop.offsetY = Math.max(-maxY, Math.min(maxY, state.photoCrop.offsetY));
    updatePreview();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => preview.addEventListener(type, () => { dragStart = null; }));

  $("#downloadResult").addEventListener("click", async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await downloadActivityResult(resultDetails());
      $("#resultMessage").textContent = "Your flattened JPG result card has been downloaded.";
    } catch (error) {
      console.error("Result card generation failed:", error);
      $("#resultMessage").textContent = "We could not generate the JPG result card. Please try again.";
    } finally {
      button.disabled = false;
    }
  });
  $("#playAgain").addEventListener("click", () => showCountdown());
  $("#chooseAnother").addEventListener("click", () => {
    state.sessionActive = false;
    state.registrationActive = false;
    $(".flow-progress").hidden = false;
    state.activity = "";
    state.selection = "";
    document.querySelectorAll("[data-select-activity]").forEach(card => {
      card.classList.remove("is-selected");
      card.setAttribute("aria-pressed", "false");
    });
    $("#activityNext").disabled = true;
    $("#playerName").value = "";
    setFlowStep(1);
    $("#activitySelection").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Reduced-motion users still receive the achievement, without celebration movement.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const intensity = achievement.celebration === "grand" ? 26 : achievement.celebration === "confetti" ? 16 : achievement.celebration === "stars" ? 9 : 3;
    launchAchievementCelebration(intensity, achievement.theme);
  }
  $("#activityResults").scrollIntoView({ behavior: "smooth", block: "start" });
}

function launchAchievementCelebration(count, theme) {
  const layer = document.createElement("div");
  layer.className = "achievement-celebration";
  layer.setAttribute("aria-hidden", "true");
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.textContent = index % 2 ? "✦" : "★";
    piece.style.left = `${(index * 37) % 100}%`;
    piece.style.setProperty("--celebration-delay", `${(index % 7) * 0.12}s`);
    piece.style.setProperty("--celebration-colour", theme);
    layer.append(piece);
  }
  document.body.append(layer);
  window.setTimeout(() => layer.remove(), 2600);
}

function recordIntegrityEvent() {
  if (!state.sessionActive) return;
  const now = Date.now();
  // Visibility and window-blur events can fire together for the same focus change.
  if (now - state.lastIntegrityAt < 700) return;
  state.lastIntegrityAt = now;
  state.integrityEvents += 1;
  const warning = $("#integrityWarning");
  warning.hidden = false;
  warning.textContent = `Activity focus changed ${state.integrityEvents} time${state.integrityEvents === 1 ? "" : "s"}. Please keep this window active while you play.`;
  if (state.focusWarningTimer) window.clearTimeout(state.focusWarningTimer);
  state.focusWarningTimer = window.setTimeout(() => { warning.hidden = true; }, 4500);
}

function installCopyDeterrents() {
  const protectedArea = $("#sessionPlayArea");
  ["copy", "cut", "contextmenu", "dragstart", "selectstart"].forEach(type => {
    protectedArea.addEventListener(type, event => {
      if (state.sessionActive) event.preventDefault();
    });
  });
  document.addEventListener("keydown", event => {
    if (!state.sessionActive || !(event.ctrlKey || event.metaKey)) return;
    if (["a", "c", "x", "s", "p"].includes(event.key.toLowerCase())) event.preventDefault();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) recordIntegrityEvent();
  });
  window.addEventListener("blur", recordIntegrityEvent);
}

/** True while setup, countdown or a live activity could be lost. */
function hasProtectedProcess() {
  return state.registrationActive || state.sessionActive || !$("#countdownScreen").hidden;
}

/** Add a same-page history entry so browser Back can be confirmed during play. */
function armHistoryGuard() {
  if (state.historyGuardArmed) return;
  window.history.pushState({ luxChristiActivityGuard: true }, "", window.location.href);
  state.historyGuardArmed = true;
}

function resetRegistration() {
  clearCountdown();
  clearTimer();
  clearAdvanceTimer();
  state.registrationActive = false;
  state.sessionActive = false;
  state.activity = "";
  state.selection = "";
  state.player = "";
  $("#playerName").value = "";
  $("#selectionGrid").innerHTML = "";
  $("#selectionError").textContent = "";
  document.querySelectorAll("[data-select-activity]").forEach(card => {
    card.classList.remove("is-selected");
    card.setAttribute("aria-pressed", "false");
  });
  $("#activityNext").disabled = true;
  $("#selectionNext").disabled = true;
  $(".flow-progress").hidden = false;
  setFlowStep(1);
  $("#activitySelection").scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Return to the player-details step after a confirmed activity/countdown exit. */
function returnToPlayerSetup() {
  clearCountdown();
  clearTimer();
  clearAdvanceTimer();
  state.sessionActive = false;
  state.registrationActive = true;
  $(".flow-progress").hidden = false;
  setFlowStep(3);
  $("#playerStep").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function confirmRegistrationCancellation() {
  const confirmed = await requestConfirmation({
    title: "Cancel registration?",
    message: "Are you sure you want to cancel your registration? Your entered information may be lost.",
    confirmText: "Yes, Cancel",
    cancelText: "Continue Registration",
  });
  if (confirmed) resetRegistration();
}

async function confirmActivityExit() {
  const confirmed = await requestConfirmation({
    title: "Are you sure you want to leave?",
    message: "Your current progress may be lost if you exit now.",
    confirmText: "Yes, Exit",
    cancelText: "Continue Playing",
  });
  if (confirmed) returnToPlayerSetup();
}

function installExitProtection() {
  // Browsers only permit their own native prompt for refresh/close protection.
  window.addEventListener("beforeunload", event => {
    if (!hasProtectedProcess() || state.exitConfirmed) return;
    event.preventDefault();
    event.returnValue = "";
  });

  // Intercept links that would leave the current page while a process is active.
  document.addEventListener("click", async event => {
    const link = event.target.closest("a[href]");
    if (!link || !hasProtectedProcess() || link.target === "_blank" || link.hasAttribute("download")) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search) return;
    event.preventDefault();
    const confirmed = await requestConfirmation({
      title: "Are you sure you want to leave?",
      message: "Your current registration or activity progress may be lost if you leave this page.",
      confirmText: "Yes, Exit",
      cancelText: state.sessionActive ? "Continue Playing" : "Continue Registration",
    });
    if (!confirmed) return;
    state.exitConfirmed = true;
    state.registrationActive = false;
    state.sessionActive = false;
    clearCountdown();
    clearTimer();
    clearAdvanceTimer();
    window.location.assign(destination.href);
  });

  // Browser Back does not trigger beforeunload for same-document history changes.
  window.addEventListener("popstate", async () => {
    if (state.exitConfirmed) {
      state.exitConfirmed = false;
      state.historyGuardArmed = false;
      return;
    }
    if (!hasProtectedProcess()) return;
    // The browser has just consumed the guard entry; put it back before asking.
    window.history.pushState({ luxChristiActivityGuard: true }, "", window.location.href);
    state.historyGuardArmed = true;
    const confirmed = await requestConfirmation({
      title: "Are you sure you want to leave?",
      message: "Your current registration or activity progress may be lost if you go back now.",
      confirmText: "Yes, Exit",
      cancelText: state.sessionActive ? "Continue Playing" : "Continue Registration",
    });
    if (!confirmed) return;
    state.exitConfirmed = true;
    state.registrationActive = false;
    state.sessionActive = false;
    clearCountdown();
    clearTimer();
    clearAdvanceTimer();
    state.historyGuardArmed = false;
    window.history.back();
  });
}

function initFlow() {
  document.querySelectorAll("[data-select-activity]").forEach(button => {
    button.addEventListener("click", () => {
      state.activity = button.dataset.selectActivity;
      document.querySelectorAll("[data-select-activity]").forEach(card => {
        const selected = card === button;
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", String(selected));
      });
      $("#activityNext").disabled = false;
    });
  });

  $("#activityNext").addEventListener("click", () => {
    if (!state.activity) return;
    state.registrationActive = true;
    armHistoryGuard();
    renderSelectionOptions();
    setFlowStep(2);
  });

  $("#selectionNext").addEventListener("click", () => {
    if (!state.selection) {
      $("#selectionError").textContent = "Please choose an option before continuing.";
      return;
    }
    $("#playerNameError").textContent = "";
    $("#playerName").value = "";
    $("#startActivity").disabled = true;
    setFlowStep(3);
    $("#playerName").focus();
  });

  document.querySelectorAll("[data-flow-back]").forEach(button => {
    button.addEventListener("click", () => setFlowStep(Number(button.dataset.flowBack)));
  });

  document.querySelectorAll("[data-cancel-registration]").forEach(button => {
    button.addEventListener("click", confirmRegistrationCancellation);
  });

  $("#cancelCountdown").addEventListener("click", confirmActivityExit);
  $("#exitActivity").addEventListener("click", confirmActivityExit);

  $("#playerName").addEventListener("input", () => {
    const validation = validatePlayerName($("#playerName").value);
    $("#startActivity").disabled = !validation.valid;
    $("#playerNameError").textContent = validation.valid || !$("#playerName").value ? "" : validation.message;
  });

  $("#playerEntryForm").addEventListener("submit", event => {
    event.preventDefault();
    const validation = validatePlayerName($("#playerName").value);
    if (!validation.valid) {
      $("#playerNameError").textContent = validation.message;
      $("#playerName").focus();
      return;
    }
    state.player = validation.value;
    showCountdown();
  });
}

export function initQuizPlatform() {
  if (!$("#activityStep")) return;
  initFlow();
  installCopyDeterrents();
  installExitProtection();
}
