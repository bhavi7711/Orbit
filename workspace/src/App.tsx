import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import type { ViewId } from './components/Sidebar'
import { profiles } from './data/mock'
import type { Profile } from './data/mock'
import { AgentsView } from './views/AgentsView'
import { ConflictsView } from './views/ConflictsView'
import { AntigravityView } from './views/AntigravityView'
import { VaultView } from './views/VaultView'

function App() {
  const [view, setView] = useState<ViewId>('agents')
  const [profile, setProfile] = useState<Profile>(profiles[0])

  return (
    <div className="flex min-h-screen">
      <Sidebar
        view={view}
        onViewChange={setView}
        profile={profile}
        onProfileChange={setProfile}
      />
      <main className="flex-1 overflow-y-auto px-8 py-10 lg:px-12">
        {/* key remounts the view on profile switch so role scoping + entrances reapply */}
        {view === 'agents' && <AgentsView key={profile.id} profile={profile} />}
        {view === 'conflicts' && <ConflictsView key={profile.id} />}
        {view === 'antigravity' && <AntigravityView key={profile.id} profile={profile} />}
        {view === 'vault' && <VaultView key={profile.id} profile={profile} />}
      </main>
    </div>
  )
}

export default App
