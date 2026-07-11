import { useState } from 'react'
import { motion } from 'framer-motion'
import { slideUp, staggerContainer } from '../theme'
import { versions as initialVersions } from '../data/mock'
import type { Profile, Version } from '../data/mock'
import { CheckIcon, RotateCcwIcon, XIcon } from '../components/icons'

export function AntigravityView({ profile }: { profile: Profile }) {
  const [versions, setVersions] = useState<Version[]>(initialVersions)

  const approve = (id: string) =>
    setVersions((vs) =>
      vs.map((v) =>
        v.id === id
          ? { ...v, status: 'live', label: `${v.id} — live`, source: `${v.source} · approved by ${profile.name}` }
          : v.status === 'live'
            ? { ...v, status: 'previous', label: v.id }
            : v,
      ),
    )

  const deny = (id: string) => setVersions((vs) => vs.filter((v) => v.id !== id))

  const rollback = (id: string) =>
    setVersions((vs) =>
      vs.map((v) =>
        v.id === id
          ? { ...v, status: 'live', label: `${v.id} — live (rolled back by ${profile.name})` }
          : v.status === 'live'
            ? { ...v, status: 'previous', label: v.id }
            : v,
      ),
    )

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.header variants={slideUp} className="mb-8">
        <h1 className="text-page-title">Antigravity edit history</h1>
        <p className="text-body text-text-secondary">
          Every edit is versioned in the local Gemma vault — approve proposed edits, roll back
          instantly.{' '}
          {!profile.canApproveEdits && 'Your role is view-only: approvals need a founder profile.'}
        </p>
      </motion.header>

      <div className="max-w-3xl space-y-4">
        {versions.map((v) => (
          <motion.article
            key={v.id}
            variants={slideUp}
            className={`card ${v.status === 'live' ? 'border-primary' : ''} ${
              v.status === 'pending-approval' ? 'border-dashed' : ''
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-card-title">{v.label}</h2>
                  {v.status === 'live' && (
                    <span className="tag bg-primary-soft text-primary">Live</span>
                  )}
                  {v.status === 'pending-approval' && (
                    <span className="tag bg-primary text-text-inverse">Awaiting approval</span>
                  )}
                </div>
                <p className="mt-2 text-body">{v.summary}</p>
                <p className="mt-1 text-label text-text-secondary">
                  {v.source} · {v.time}
                </p>
              </div>

              {profile.canApproveEdits && (
                <div className="flex shrink-0 gap-2">
                  {v.status === 'pending-approval' && (
                    <>
                      <button type="button" className="btn-primary" onClick={() => approve(v.id)}>
                        <CheckIcon size={16} /> Approve
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => deny(v.id)}>
                        <XIcon size={16} /> Deny
                      </button>
                    </>
                  )}
                  {v.status === 'previous' && (
                    <button type="button" className="btn-secondary" onClick={() => rollback(v.id)}>
                      <RotateCcwIcon size={16} /> Roll back
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}
