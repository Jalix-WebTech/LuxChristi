# Quiz & Games timer, scoring, anti-copy deterrents and test checklist

## Implemented in this frontend

- A five-second preparation countdown before both Quiz and Games begin.
- An independent seven-second timer for every quiz question and every game round.
- Deadline-based timing using `performance.now()` to reduce drift.
- Automatic question locking and progression after a response or timeout.
- A 100-point correctness award plus a proportional speed bonus of up to 50 points.
- Incorrect and unanswered questions receive zero points.
- Response-time tracking and a final performance summary.
- Question and answer order are shuffled where supported by the current data model.
- Text selection, drag, copy, cut, context menu and common copy shortcuts are blocked within the active question area.
- Tab visibility and window-focus changes are recorded and shown as non-punitive warnings.
- Correct answers and explanations are shown only after the response is locked in the user interface.
- Result cards can include a player-selected profile photograph.
- Category and game selection interfaces do not reveal stored question counts.

## Manual tests

1. Visit `quiz.html`; confirm the intro, Top Winners and activity selection appear in order.
2. Try to continue without choosing Quiz or Games; Next should remain disabled.
3. Choose Quiz, select a category and verify the selection screen does not show question-bank counts.
4. Go Back and confirm the selected activity remains selected.
5. Enter an invalid name; Start should remain disabled and validation feedback should appear.
6. Enter a valid name and start; verify the countdown shows 5, 4, 3, 2, 1, 0 before the first question.
7. Verify every quiz question has a fresh seven-second timer and automatically advances after timeout.
8. Repeat the flow for Games and verify every game round also has its own seven-second timer.
9. Answer correctly at different speeds; confirm the faster response receives more points.
10. Confirm incorrect and unanswered questions receive zero points and cannot be submitted more than once.
11. Try selecting/copying question text, using Ctrl/Cmd+C, Ctrl/Cmd+A and right-click during an active question.
12. Switch tabs or focus another window; verify a non-punitive integrity warning is recorded.
13. Complete an activity; confirm the result includes the entered name, points, correct/incorrect/unanswered counts, average response time and accuracy.
14. Download a result card with and without a profile photo.
15. Test desktop, tablet and mobile widths, including narrow screens.

## Important security limitation

These frontend measures are deterrents only. Browser developer tools, screenshots, external cameras, source inspection, network inspection and modified JavaScript can bypass them. Because the question banks and answer keys are static JavaScript modules, they are not secret. Official competition security requires backend-controlled question delivery, answer validation, deadlines, scoring, authenticated attempts, rate limits and audit logs. The browser-generated result card is not proof of an official score.

## Exit and cancellation protection

- Setup becomes a protected registration process after the player advances from activity selection.
- The registration steps include a **Cancel registration** action that opens the branded confirmation dialog.
- The countdown and active quiz/game include a confirmed exit action; confirming returns the player to the player-details step so they can restart.
- Navigation links and browser Back are intercepted while registration or gameplay is active and use the same accessible confirmation dialog.
- Refresh and tab/window close use the browser's native `beforeunload` prompt because browsers do not allow websites to replace that security prompt with a custom modal.
- A confirmed navigation clears timers and bypasses a second unload prompt.

## Manual exit and result-card tests

1. Advance to category selection and click **Cancel registration**; choose Continue Registration and verify the flow remains unchanged.
2. Repeat and choose Yes, Cancel; verify the flow returns to the first activity-selection step.
3. During the five-second countdown, click Cancel and verify confirmation; continue returns to the countdown and exit returns to player details.
4. During a quiz and a game, click Exit activity; Continue Playing must keep the current question and timer active.
5. Confirm exit and verify the player returns to player details with the current attempt discarded.
6. While registering or playing, click a site navigation link and use browser Back; both should request confirmation.
7. While registering or playing, attempt refresh or tab close; verify the browser's native leave-page prompt appears.
8. Confirm navigation and verify there is no second beforeunload prompt.
9. Enter only Diocese and Parish; confirm the preview and JPG show bold `Diocese:` and `Parish:` labels and omit Deanery entirely.
10. Leave all three community fields empty; confirm the preview and JPG show no community labels and the download still succeeds.
11. Enter long community names and verify they wrap within the card without clipping.

Browser refresh/close prompts are intentionally native browser prompts; custom branded dialogs are used for in-page actions and navigation links.
