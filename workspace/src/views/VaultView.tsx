import { motion } from 'framer-motion'
import { slideUp, staggerContainer } from '../theme'
import { vaultItems } from '../data/mock'
import type { Profile } from '../data/mock'
import { CloudIcon, LockIcon } from '../components/icons'

export function VaultView({ profile }: { profile: Profile }) {
  const shared = vaultItems.filter((i) => i.scope === 'shared')
  const local = vaultItems.filter((i) => i.scope === 'local')
  const localVisible = profile.canViewFinancials

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.header variants={slideUp} className="mb-8">
        <h1 className="text-page-title">Vault &amp; sync</h1>
        <p className="text-body text-text-secondary">
          What synced to the shared team context vs. what never left this device.
        </p>
      </motion.header>

      <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.section variants={slideUp} className="card">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-button bg-primary-soft text-primary">
              <CloudIcon size={18} />
            </span>
            <div>
              <h2 className="text-card-title">Shared team context</h2>
              <p className="text-label text-text-secondary">
                Synced to cloud · visible to all profiles (role-scoped)
              </p>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {shared.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-body font-medium">{item.name}</p>
                  {item.derivedFact && (
                    <p className="text-label text-text-secondary">{item.derivedFact}</p>
                  )}
                </div>
                <span className="tag bg-background text-success border border-border">Synced</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={slideUp} className="card border-dashed">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-button bg-dark-surface text-text-inverse">
              <LockIcon size={18} />
            </span>
            <div>
              <h2 className="text-card-title">Private vault (this device)</h2>
              <p className="text-label text-text-secondary">
                Gemma-held · raw data never syncs, only derived facts
              </p>
            </div>
          </div>
          {localVisible ? (
            <ul className="divide-y divide-border">
              {local.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-body font-medium">{item.name}</p>
                    {item.derivedFact && (
                      <p className="text-label text-text-secondary">{item.derivedFact}</p>
                    )}
                  </div>
                  <span className="tag bg-dark-surface text-text-inverse">Device-only</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-button border border-border bg-background px-4 py-6 text-center text-body text-text-secondary">
              Your role scope ({profile.role}) can’t view financial or identity items in this
              vault. Derived facts the agents use are still available in the shared context.
            </p>
          )}
        </motion.section>
      </div>
    </motion.div>
  )
}
