import { GridIcon, HistoryIcon, ScaleIcon, ShieldIcon } from './icons'
import type { Profile } from '../data/mock'
import { profiles } from '../data/mock'

export type ViewId = 'agents' | 'conflicts' | 'antigravity' | 'vault'

const navItems: { id: ViewId; label: string; icon: typeof GridIcon }[] = [
  { id: 'agents', label: 'Agent activity', icon: GridIcon },
  { id: 'conflicts', label: 'Conflict resolution', icon: ScaleIcon },
  { id: 'antigravity', label: 'Antigravity history', icon: HistoryIcon },
  { id: 'vault', label: 'Vault & sync', icon: ShieldIcon },
]

interface SidebarProps {
  view: ViewId
  onViewChange: (v: ViewId) => void
  profile: Profile
  onProfileChange: (p: Profile) => void
}

export function Sidebar({ view, onViewChange, profile, onProfileChange }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      {/* Same logo markup as the landing pages (landing/index.html header) */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-primary">
          <span
            className="material-symbols-outlined text-text-inverse"
            style={{ fontSize: '18px' }}
            aria-hidden
          >
            orbit
          </span>
        </span>
        <span className="text-xl font-extrabold tracking-tight">Orbit</span>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Workspace">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-button px-3 py-2.5 text-body font-medium transition-colors duration-200 ${
                active
                  ? 'bg-primary-soft text-primary'
                  : 'text-text-primary hover:bg-background'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <p className="px-3 pb-2 text-label uppercase tracking-wider text-text-secondary">
          Profile
        </p>
        <div className="space-y-1">
          {profiles.map((p) => {
            const active = p.id === profile.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onProfileChange(p)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-button px-3 py-2 text-left transition-colors duration-200 ${
                  active ? 'bg-primary-soft' : 'hover:bg-background'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-label font-semibold ${
                    active
                      ? 'bg-primary text-text-inverse'
                      : 'bg-background text-text-primary border border-border'
                  }`}
                >
                  {p.name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-body font-medium leading-tight">
                    {p.name}
                  </span>
                  <span className="block text-label text-text-secondary">{p.role}</span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="px-3 pt-3 text-label text-text-secondary">
          {profile.canViewFinancials
            ? 'Full access · can approve edits'
            : 'Role-scoped: no financials, view-only edits'}
        </p>
        <a
          href="/landing/"
          className="mt-2 block rounded-button px-3 py-2 text-label font-medium text-text-secondary transition-colors duration-200 hover:bg-background hover:text-primary"
        >
          Landing site →
        </a>
      </div>
    </aside>
  )
}
