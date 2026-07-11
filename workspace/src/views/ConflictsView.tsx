import { motion } from 'framer-motion'
import { slideUp, staggerContainer } from '../theme'
import { conflicts } from '../data/mock'
import { ScaleIcon } from '../components/icons'

export function ConflictsView() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.header variants={slideUp} className="mb-8">
        <h1 className="text-page-title">Conflict resolution</h1>
        <p className="text-body text-text-secondary">
          Every disagreement between agents is arbitrated visibly — nothing is resolved off
          screen.
        </p>
      </motion.header>

      <div className="max-w-3xl space-y-6">
        {conflicts.map((c) => (
          <motion.article key={c.id} variants={slideUp} className="card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-button bg-primary-soft text-primary">
                  <ScaleIcon size={18} />
                </span>
                <p className="text-label text-text-secondary">
                  {c.between[0]} <span className="text-primary font-semibold">vs</span>{' '}
                  {c.between[1]}
                </p>
              </div>
              <span
                className={`tag ${
                  c.status === 'resolved'
                    ? 'bg-background text-success border border-border'
                    : 'bg-primary text-text-inverse'
                }`}
              >
                {c.status === 'resolved' ? 'Resolved' : 'Arbitrating'}
              </span>
            </div>
            <h2 className="text-card-title">{c.topic}</h2>
            <p className="mt-2 text-body text-text-secondary">{c.detail}</p>
            <div className="mt-4 rounded-button border border-border bg-background px-4 py-3">
              <p className="text-label uppercase tracking-wider text-text-secondary">Ruling</p>
              <p className="mt-1 text-body">{c.ruling}</p>
            </div>
            <p className="mt-3 text-label text-text-secondary">{c.time}</p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}
