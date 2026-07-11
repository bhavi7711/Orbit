# Orbit — The Autonomous Founder Operating System

From "I have an idea" to "I have a live, tested, marketed business" — a smart ecosystem of AI agents that helps real-world founders **build and scale**, in any language, solo or with a team.

See [ORBIT.md](ORBIT.md) for the full concept and architecture, and [progress.md](progress.md) for the team task split and status tracker.

## What's in this repo

| Path | What it is | Runs on |
|---|---|---|
| `landing/` | Static marketing site: landing, onboarding demo, Step 0–9 workflow, EN/HI/TA i18n | served at `:3001/landing/` |
| `workspace/` | React onboarding funnel (solo/team → founder details → idea → launch) | `:3001` |
| `packages/client` | The agent dashboard — Mission Control + 7 AI departments | `:3000` |
| `packages/server` | Express API: Gemini-powered agents, creative studio, context engine | `:5000` |
| `packages/core` | Shared TypeScript types/schemas | library |

**The funnel:** `:3001/landing/` → Get Started → onboarding (`:3001`) → launch → agent dashboard (`:3000`).

## The agents (all real, Gemini-powered)

- **Research** — live Google-Search-grounded market research: sizes, competitors, real prices
- **Finance** — runway, unit economics, pricing, GST/tax and funding guidance with actual math
- **Marketing** — growth strategy + poster studio (Nano Banana) + ad videos (Veo 3.1)
- **Creative** — multilingual captions + real TTS voiceovers
- **Deck** — investor pitch deck built from live agent context, exported as PPTX
- **Code** — StartupForge / Fix-your-MVP handoff to the Antigravity build system (Ashish's track)
- **Conflict** — arbitration center; active disputes gate agent actions

Every agent shares memory: recent cross-agent activity and uploaded-document summaries are injected into each prompt, so agents reference each other's work. Founder-uploaded files (invoices, ITRs, plans) are summarized locally and become ground truth for all agents.

## Quick start

```bash
npm install
cp packages/server/.env.example packages/server/.env   # paste a real GEMINI_API_KEY
npm run build:core
npm run dev            # server :5000 + dashboard :3000
cd workspace && npm install && npm run dev   # onboarding + landing on :3001
```

Never commit `.env`, `dist/`, `*.tsbuildinfo`, or compiled `.js` beside `.tsx` sources (they shadow sources in Vite).

## Team

- **Preethesh** — landing site, workflow UI, agent platform integration ([changes-by-preethesh.md](changes-by-preethesh.md))
- **Deepthi** — workspace platform & design system ([changes-by-deepthi.md](changes-by-deepthi.md))
- **Ashish** — Gemma local vault, document ingestion, Antigravity code automation ([changes-by-ashish.md](changes-by-ashish.md), [ONBOARDING-ASHISH.md](ONBOARDING-ASHISH.md))
- **Bhavi** — multi-agent orchestration, onboarding funnel ([changes-by-bhavi.md](changes-by-bhavi.md))
