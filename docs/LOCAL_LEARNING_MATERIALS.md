# Lux Christi — Locally Hosted Learning Materials (MVP)

## What this milestone adds

- Three original, structured starter lessons bundled with the application:
  - How to Read the Bible
  - Understanding the Structure of the Catholic Bible
  - Prayer: Listening and Responding to God
- Learning objectives, lesson sections, key points, reflection prompts, one knowledge check per lesson, and further-reading references.
- A lesson reader that renders the lesson from local JavaScript data; it does not fetch lesson content from a server.
- Downloadable plain-text study notes generated on the device.
- Per-device lesson completion tracking using localStorage and a simple progress indicator.
- A visible offline availability indicator in the reader.
- Service worker cache version incremented to v3 and local lesson data included in the app-shell precache.

## Offline behaviour

After the updated service worker has installed successfully while online, the three bundled lessons and reader interface are available offline. The downloaded study notes are ordinary text files and can be opened with a compatible notes/text application. External reference links remain external and may need an internet connection. Bookmarks and lesson progress remain local to the current browser/device; there is no account sync.

## Content and scope

These are introductory Catholic learning summaries, not a replacement for Scripture, the Catechism, liturgical books, formal instruction, or local diocesan guidance. References are supplied so learners can continue studying. The current content is a small starter collection, not a complete curriculum or accredited course.

## Test

Run:

```bash
npm test
npm run check
npm run serve
```

Open `http://localhost:8000/learn.html`, open each lesson, answer its knowledge check, download its notes, mark it complete, reload the page and confirm progress remains. Then allow the service worker update to install and test the lessons offline.

## Known limitations

- No hosted PDF library, video lessons, teacher dashboard, learner accounts, cloud sync, grading system or course enrolment yet.
- Downloaded notes are `.txt` files, not PDF documents.
- Lesson completion is a local self-tracking feature and is not a verified assessment credential.
- External resources and references are not mirrored into the app.
