# Get Shit Done

A gamified daily task + focus app built from the *Get Shit Done* book and worksheet by Knute Steel.

The whole app is a single self-contained HTML file (`index.html`) — React via CDN + Babel standalone, no build step required. Open it in any browser or host it on any static host.

## Core concept

A points-driven task matrix that rewards real work, punishes busywork, and keeps you moving with snarky-but-motivating feedback.

| Category | Points |
| --- | ---: |
| Need to Do It – Now | +3 |
| Need to Do It – Someday | +2 |
| Need to Do It – For Some Reason | +1 |
| Why Is This On My List? | -1 |
| Squirrel! (distraction) | 0 |
| Damn I'm Good – Look What I Get | bonus |
| What Was I Thinking? | reflection / 0 |

## Features

- Fast task capture with category + due date + notes
- Drag-and-drop between categories (Matrix view)
- Automatic scoring: daily, total, streak
- Completion popups with edgy feedback pools
- Brain Dump for quick capture
- Calendar view (month / week / day)
- Wins board and reflection log
- Weekly reset workflow
- Daily "News of the Day" rabbit-hole stories with squirrel-warning popups
- Amazon review prompt (+5 points, weekly contest)
- Reviews tab with upvote/downvote on book reviews
- "Why Am I Here" tab with full book manuscript and sticky chapter navigation
- Firebase Auth (passwordless email link sign-in)
- Firebase Firestore for user data + paywall
- Admin dashboard — restricted to the owner account

## Run locally

Just open `index.html` in a browser. That's it.

## Deploy

Hosted on GitHub Pages. No build step, no environment variables. Just static files served from the `main` branch root.

---

Based on *Get Shit Done* by Knute Steel — [on Amazon](https://www.amazon.com/Stop-Getting-Distracted-Your-Done/dp/B0FVF9HNYX).
