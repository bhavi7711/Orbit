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

## [2026-07-11] — Interactive workflow demo (`landing/demo.html`)
**Prompt/ask:** Preethesh wanted to try the Step 0–9 workflow with his own details (solo founder, clothing brand CAZ) — entering them in a form rather than a hardcoded dummy.
**Changes made:** `landing/demo.html` — intake form (name, email, brand, category, one-line idea, solo/team mode, optional unit cost) that generates a personalized workspace simulation: dark workspace header with masked email, Gemma vault banner, all 12 workflow cards streaming in one-by-one with Done/Live/Queued badges, pricing/margin computed from the entered unit cost, category-aware copy (clothing gets streetwear-specific research/conflict content), and a "Pending your approval" card with clickable Approve buttons (GST filing, launch kit, Antigravity edit). Runs fully client-side; the step data shape mirrors what the Manager Agent roadmap API will return, so it can be wired to live agents later without changing the rendering. Verified headlessly with Playwright (CAZ / ₹210 unit cost → ₹549 price, 62% margin, 12 steps, 3 approvals, no JS errors).
**Why:** Gives the team a tangible end-to-end demo of the product story to show and test against, before any backend exists.

## [2026-07-11] — Workflow page made stateful (no more pre-filled statuses)
**Prompt/ask:** Preethesh flagged that `workflow.html` showed hardcoded statuses (Steps 0–1 "Done", Step 2 "In progress") as if work already happened — he wanted to enter his own details and progress through steps himself.
**Changes made:**
- `landing/assets/store.js` — new shared localStorage state module (`orbit.workspace`: founder details + progress index) so progress survives reloads and can be shared across pages.
- `landing/workflow.html` — rewritten: with no saved workspace it shows an intake form (name, email, brand, category, idea, mode, unit cost); submitting counts as Step 0 and everything else starts Queued. The next step shows an "Up next" ring with a "Run this step" button; running it swaps the generic description for a personalized result (pricing/margin from unit cost, category-aware research/conflict content, masked email in header). Reset workspace button in navbar clears state.
- Verified with Playwright: fresh visit shows intake; creating CAZ workspace → 1/11; ran 3 steps → 4/11; reload persists at 4/11; reset returns to intake; no JS errors.
**Why:** Demo state was misleading — the roadmap must reflect the founder's actual progress, and the progress-driven rendering is the same contract the Manager Agent API will fill later.

## [2026-07-11] — Workflow intake reduced to name + Gmail only
**Prompt/ask:** Preethesh: drop category/brand/idea/cost from the intake — just name and Gmail; the business context will come from Ashish's Gemma vault/document-ingestion side.
**Changes made:** `landing/workflow.html` — intake form now has only name + Gmail with an info note that brand/idea/financials sync from the Gemma vault; `enrich()` fills vault-pending placeholders (workspace titled "<Name>'s workspace", "(idea pending — will sync from your Gemma vault)", fallback site URL, benchmark pricing) until the vault API exists. Verified with Playwright: 2-field form, all 10 remaining steps run without errors on placeholder context.
**Why:** Matches the real architecture — identity is the only thing the founder types; everything else is ground truth owned by the Gemma vault (Ashish's integration point, see progress.md Integration Points).
