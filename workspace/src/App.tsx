import { motion } from 'framer-motion'
import { hoverLift, slideUp, staggerContainer } from './theme'

/**
 * Placeholder root. No real pages yet — this renders a small token smoke test
 * so `npm run dev` visually confirms the theme (colors, type scale, card,
 * buttons, motion presets) is wired up. Replace with the workspace shell.
 */
function App() {
  return (
    <motion.main
      className="mx-auto max-w-3xl px-6 py-16 space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={slideUp} className="space-y-2">
        <p className="text-label uppercase tracking-widest text-text-secondary">
          Orbit Workspace
        </p>
        <h1 className="text-page-title">Design system ready</h1>
        <p className="text-body text-text-secondary">
          Tokens, type scale, and motion presets are wired. Build pages on top
          of these — never hardcode colors, sizes, or animations.
        </p>
      </motion.header>

      <motion.div variants={slideUp} {...hoverLift}>
        <div className="card hover:shadow-lift transition-shadow duration-entrance ease-entrance space-y-4">
          <h2 className="text-card-title">Sample card</h2>
          <div className="flex items-baseline gap-2">
            <span data-stat className="text-stat">
              128
            </span>
            <span className="text-label text-success">+12% this week</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary">
              Primary action
            </button>
            <button type="button" className="btn-secondary">
              Secondary
            </button>
            <span className="tag bg-primary-soft text-primary">Active</span>
          </div>
        </div>
      </motion.div>
    </motion.main>
  )
}

export default App
