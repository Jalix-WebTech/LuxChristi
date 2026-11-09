# Events & Competitions — Manual Browser Check

## Start the local website

From the project root, run:

```bash
npm run serve
```

Open `http://localhost:8000/events.html` in a desktop browser. For mobile layout, use browser developer tools and select a 390px-wide device viewport.

## Events listing

- Confirm the page header and navigation match the rest of Lux Christi.
- Confirm the hero buttons scroll to the correct sections.
- Confirm the featured and upcoming sections show the intentional empty state while no approved event exists.
- Confirm all five category cards render.
- Confirm the past-competitions section explains that official results will appear after events.
- Confirm the community CTA opens the Community page.

## Responsive and accessibility checks

- Check at desktop width (1440px), tablet width (768px) and mobile width (390px).
- Confirm cards do not overflow horizontally.
- Open and close the mobile navigation; confirm the menu button's expanded state changes.
- Tab through links and controls; confirm keyboard focus is visible.
- Toggle light and dark themes.
- Check that reduced-motion settings do not cause unwanted animation.

## Event details

The public event catalogue is intentionally empty. To test a details record, add a temporary event to `js/data/events.js` with a unique ID and an approved test-only title, then visit:

`http://localhost:8000/event.html?id=<temporary-id>`

Remove the temporary record before publishing. Never use real contestant data or private meeting credentials in a frontend test fixture.

## Automated checks

Run:

```bash
npm test
npm run check
```

