# Changes by Deepthi

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

## [2026-07-11] — Global UI theme / design system (branch: deepthi/workspace-theme)
**Prompt/ask:** As Deepthi, on a separate branch, set up the global UI theme only (no pages): strict color palette (cream #F7F5F1 bg, burnt orange #F0632A primary, etc.), Inter typography scale, style rules (radii, card style, spacing, buttons, icons), and framer-motion motion tokens — matching Preethesh's landing page aesthetic. Guided by the `ui-ux-pro-max` and `antigravity-design-expert` skills.
**Changes made:** Scaffolded `workspace/` (Vite + React + TypeScript, Tailwind v3, framer-motion). Created `workspace/src/theme/tokens.css` (CSS variables + base styles + `.card`/`.btn-primary`/`.btn-secondary`/`.tag`), `workspace/tailwind.config.js` (utilities mapped onto the CSS variables: colors, full type scale, `rounded-card/button/pill`, `shadow-card/lift`, section spacing, motion easings), `workspace/src/theme/motion.ts` (`fadeIn`, `slideUp`, `staggerContainer`, `hoverScale`, `hoverLift` — 0.35s easeOut entrances, 0.3s easeInOut hovers), `workspace/src/theme/index.ts` (JS token mirrors for charts), `workspace/src/theme/README.md` (conventions doc). `index.html` loads Inter 400–700; `main.tsx` wraps the app in `<MotionConfig reducedMotion="user">`; `App.tsx` is a token smoke-test placeholder only. Production build verified.
**Why:** Every future workspace page (agent dashboard, conflict feed, Antigravity history, vault indicator) must pull from one token source instead of ad-hoc values, and stay visually consistent with the landing page. Work kept off `main` per instruction — nothing merged until Deepthi says so.

## [2026-07-11] — Merged workspace theme into main
**Prompt/ask:** Pull latest main and merge `deepthi/workspace-theme` into it (merge explicitly authorized by Deepthi).
**Changes made:** Pulled main (picked up Preethesh's landing v1: `landing/` pages + i18n). Merged `deepthi/workspace-theme` → main (merge commit `eeb4930`); resolved a `progress.md` conflict by keeping Preethesh's Done rows and re-adding the Deepthi theme row. Pushed main to origin.
**Why:** Theme foundation needs to be on main so both tracks build on the same tokens; landing (`landing/assets/theme.js`) and workspace (`workspace/src/theme/`) now share the same palette, worth unifying later.
