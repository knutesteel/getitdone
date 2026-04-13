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
- "Weird News of the Week" meme banner on every tab (25 stories, 6 shown per reload) with squirrel-warning popups that cost -1 point to chase
- Amazon review prompt (+5 points, weekly contest)
- Reviews tab with upvote/downvote on book reviews
- Email-gated login
- Admin analytics dashboard (DAU/WAU/MAU, sessions, feature usage, retention) — restricted to the owner account

## Run locally

Just open `index.html` in a browser. That's it.

## Deploy

Any static host works (Netlify, Vercel, Cloudflare Pages, GitHub Pages). No build, no environment variables.

## Roadmap

- Wire up a real analytics provider (PostHog / Mixpanel / Amplitude) to replace the simulated admin stats
- Real auth + persistence (currently in-memory per session)
- Weekly news + review pools pulled from a CMS instead of hard-coded arrays

---

Based on *Get Shit Done* by Knute Steel — [on Amazon](https://www.amazon.com/Stop-Getting-Distracted-Your-Done/dp/B0FVF9HNYX).
