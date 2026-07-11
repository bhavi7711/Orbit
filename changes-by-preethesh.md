# Changes by Preethesh

Append one entry per prompt/session below, newest at the bottom. Use this template:

```
## [YYYY-MM-DD] — <short title>
**Prompt/ask:** what was requested
**Changes made:** files touched + what changed
**Why:** context/decision
```

---

## [2026-07-11] — Repo docs bootstrapped
**Prompt/ask:** Turn the Orbit concept doc into project files, split landing/workspace/workflow work between Preethesh and Deepthi, and track progress.
**Changes made:** Created `ORBIT.md` (full plan), `progress.md` (shared tracker with task split), `changes-by-preethesh.md`, `changes-by-deepthi.md`.
**Why:** Establish a shared reference doc and a place to track who's doing what, so Preethesh and Deepthi don't have to re-explain context to each other or to future sessions.

## [2026-07-11] — Landing page v1 built (branch `preethesh/landing-page`)
**Prompt/ask:** Given an HTML design inspiration (warm orange Material-style theme), build Preethesh's whole track in one shot on a separate branch.
**Changes made:**
- `landing/index.html` — full marketing landing page: hero, dark dashboard mockup with live agent feed, multilingual showcase with working language toggle, 6-agent feature grid, document-ingestion section, continuous-improvement loop strip, integrations strip, CTA, footer. All branding is **Orbit** (inspiration said "Ordbit"; corrected). Hotlinked mockup images from the inspiration replaced with CSS-built mockups so the page has no external image dependencies.
- `landing/onboarding.html` — Solo vs Team mode choice (ORBIT.md Section 2); Team path reveals invite + role assignment UI (email + role, add/remove, in-memory list) and the syncs-vs-stays-local scope table; done state links to workflow.
- `landing/workflow.html` — Step 0 → 9 roadmap visualization (ORBIT.md Section 9) rendered from a JS STEPS array with done/active/queued status badges, ready to be fed later by the Manager Agent API.
- `landing/assets/theme.js` — shared Tailwind CDN config (colors/spacing/type from the inspiration design).
- `landing/assets/i18n.js` — i18n plumbing: `data-i18n` attribute contract, EN/HI/TA dictionaries, language selector auto-mounted into `#lang-selector`, choice persisted in localStorage. Same contract Gemma's on-device translation will replace later.
**Why:** Ships all five of Preethesh's tasks as a static, dependency-free v1 (Tailwind via CDN, no build step) so it can be opened directly in a browser and iterated on; the design follows the provided inspiration but with Orbit branding and self-contained assets.
