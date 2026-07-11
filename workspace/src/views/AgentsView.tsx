import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeIn, hoverLift, slideUp, staggerContainer } from '../theme'
import { agents } from '../data/mock'
import type { Agent, Profile } from '../data/mock'
import { agentIcons, XIcon } from '../components/icons'

const statusStyles: Record<Agent['status'], { label: string; className: string }> = {
  working: { label: 'Working', className: 'bg-primary-soft text-primary' },
  idle: { label: 'Idle', className: 'bg-background text-text-secondary border border-border' },
  'needs-approval': { label: 'Needs approval', className: 'bg-primary text-text-inverse' },
}

export function AgentsView({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState<Agent | null>(null)
  const visible = agents.filter((a) => profile.agentAccess.includes(a.id))
  const hiddenCount = agents.length - visible.length

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.header variants={slideUp} className="mb-8">
        <h1 className="text-page-title">Agent activity</h1>
        <p className="text-body text-text-secondary">
          Live status of your agent team.{' '}
          {hiddenCount > 0 &&
            `${hiddenCount} agent${hiddenCount > 1 ? 's' : ''} hidden by your role scope.`}
        </p>
      </motion.header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((agent) => {
          const Icon = agentIcons[agent.id]
          const status = statusStyles[agent.status]
          return (
            <motion.button
              key={agent.id}
              type="button"
              variants={slideUp}
              {...hoverLift}
              onClick={() => setOpen(agent)}
              className="card cursor-pointer text-left transition-shadow duration-entrance ease-entrance hover:shadow-lift"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-button bg-primary-soft text-primary">
                  <Icon size={20} />
                </span>
                <span className={`tag ${status.className}`}>{status.label}</span>
              </div>
              <h2 className="text-card-title">{agent.name}</h2>
              <p className="mt-1 text-label text-text-secondary">{agent.descriptor}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span data-stat className="text-stat">
                  {agent.stat.value}
                </span>
                <span
                  className={`text-label ${agent.stat.positive ? 'text-success' : 'text-text-secondary'}`}
                >
                  {agent.stat.label}
                </span>
              </div>
              <p className="mt-4 border-t border-border pt-3 text-label text-text-secondary">
                {agent.lastActivity}
              </p>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-30 flex justify-end bg-text-primary/30"
            onClick={() => setOpen(null)}
          >
            <motion.aside
              initial={{ x: 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 48, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-lift"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={`${open.name} conversation`}
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-card-title">{open.name}</h2>
                  <p className="text-label text-text-secondary">Conversation</p>
                </div>
                <button
                  type="button"
                  aria-label="Close conversation"
                  onClick={() => setOpen(null)}
                  className="cursor-pointer rounded-button p-2 text-text-secondary transition-colors duration-200 hover:bg-background hover:text-text-primary"
                >
                  <XIcon size={16} />
                </button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {open.conversation.map((m, i) => (
                  <div key={i} className={m.from === 'founder' ? 'text-right' : ''}>
                    <p className="mb-1 text-label text-text-secondary">
                      {m.from === 'agent'
                        ? open.name
                        : m.from === 'manager'
                          ? 'Manager Agent'
                          : 'You'}{' '}
                      · {m.time}
                    </p>
                    <p
                      className={`inline-block max-w-[90%] rounded-card px-4 py-3 text-body ${
                        m.from === 'founder'
                          ? 'bg-primary text-text-inverse'
                          : 'border border-border bg-background text-text-primary'
                      }`}
                    >
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-6 py-4">
                <p className="text-label text-text-secondary">
                  Live conversation wiring lands with the Managed Agents orchestrator.
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
