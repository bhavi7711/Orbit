/**
 * Mock data for the workspace dashboard.
 * Shapes mirror the integration contracts listed in progress.md:
 * - Gemma vault API (Ashish): profiles, scope, sync state
 * - Antigravity edit/version API (Ashish): versions, edit requests
 * - Agent/conflict events (Bhavi): agent activity, arbitration feed
 * Replace this module with real API clients when those land.
 */

export type Role = 'Founder' | 'Co-founder' | 'Marketing hire' | 'Ops hire'

export interface Profile {
  id: string
  name: string
  role: Role
  /** Agent ids this profile may view (role-scoped permissions). */
  agentAccess: string[]
  canViewFinancials: boolean
  canApproveEdits: boolean
}

export type AgentStatus = 'working' | 'idle' | 'needs-approval'

export interface AgentMessage {
  from: 'agent' | 'manager' | 'founder'
  text: string
  time: string
}

export interface Agent {
  id: string
  name: string
  descriptor: string
  status: AgentStatus
  lastActivity: string
  stat: { label: string; value: string; positive?: boolean }
  conversation: AgentMessage[]
}

export interface Conflict {
  id: string
  between: [string, string]
  topic: string
  detail: string
  ruling: string
  status: 'resolved' | 'arbitrating'
  time: string
}

export interface Version {
  id: string
  label: string
  summary: string
  source: string
  time: string
  status: 'live' | 'previous' | 'pending-approval'
}

export interface VaultItem {
  id: string
  name: string
  category: string
  scope: 'shared' | 'local'
  syncState: 'synced' | 'device-only'
  derivedFact?: string
}

export const profiles: Profile[] = [
  {
    id: 'anita',
    name: 'Anita',
    role: 'Founder',
    agentAccess: ['research', 'legal', 'brand', 'build', 'sales', 'support'],
    canViewFinancials: true,
    canApproveEdits: true,
  },
  {
    id: 'ravi',
    name: 'Ravi',
    role: 'Co-founder',
    agentAccess: ['research', 'legal', 'brand', 'build', 'sales', 'support'],
    canViewFinancials: true,
    canApproveEdits: true,
  },
  {
    id: 'meera',
    name: 'Meera',
    role: 'Marketing hire',
    agentAccess: ['research', 'brand', 'sales', 'support'],
    canViewFinancials: false,
    canApproveEdits: false,
  },
]

export const agents: Agent[] = [
  {
    id: 'research',
    name: 'Research Agent',
    descriptor: 'Market validation, competitors, pricing benchmarks',
    status: 'idle',
    lastActivity: 'Competitor scan complete — 14 spice D2C brands profiled',
    stat: { label: 'Market signals', value: '32', positive: true },
    conversation: [
      { from: 'manager', text: 'Validate demand for organic spice subscriptions in tier-1 metros.', time: '09:12' },
      { from: 'agent', text: 'Scanned 14 D2C competitors. Median box price ₹649/mo; none offer Tamil-first storefronts. Pricing gap at ₹499 entry tier.', time: '09:41' },
      { from: 'agent', text: 'Pain-point signals: 61% of reviews mention stale packaging dates. Freshness guarantee is a differentiator.', time: '09:44' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Compliance Agent',
    descriptor: 'Registrations, filings, agreement drafts, claim clearance',
    status: 'working',
    lastActivity: 'Drafting FSSAI registration checklist',
    stat: { label: 'Filings current', value: '3/4' },
    conversation: [
      { from: 'manager', text: 'Check compliance requirements for food subscription commerce.', time: '10:02' },
      { from: 'agent', text: 'GST returns show registration is current — no re-filing needed. FSSAI basic registration required before any "organic" claim ships.', time: '10:18' },
      { from: 'agent', text: 'Vetoing Marketing\'s "certified organic" copy until FSSAI + Jaivik Bharat cert are on file.', time: '10:19' },
    ],
  },
  {
    id: 'brand',
    name: 'Brand & Marketing Agent',
    descriptor: 'Positioning, voice, multilingual landing copy',
    status: 'needs-approval',
    lastActivity: 'Tamil hero copy variant awaiting review',
    stat: { label: 'Copy variants live', value: '8', positive: true },
    conversation: [
      { from: 'agent', text: 'Drafted Pongal-campaign hero copy in Tamil and English, grounded in Research\'s freshness gap.', time: '11:05' },
      { from: 'agent', text: 'Reworded "certified organic" → "farm-traceable, chemical-free" per Legal\'s veto. Awaiting founder approval.', time: '11:22' },
      { from: 'founder', text: 'Show me both variants side by side before it ships.', time: '11:30' },
    ],
  },
  {
    id: 'build',
    name: 'Build Agent + Antigravity',
    descriptor: 'Live site generation and continuous plain-language edits',
    status: 'working',
    lastActivity: 'Applying pricing-above-fold edit (v6 draft)',
    stat: { label: 'Deploys this week', value: '5' },
    conversation: [
      { from: 'founder', text: 'Move pricing above the fold and add a Tamil toggle to the nav.', time: '12:01' },
      { from: 'agent', text: 'Edit drafted as v6: pricing section relocated, locale toggle wired to the content model. Conflict check passed — deploying to preview.', time: '12:04' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales / GTM Agent',
    descriptor: 'Outbound, pricing page, live customer conversations',
    status: 'idle',
    lastActivity: 'Proposed checkout-page edit from conversion data',
    stat: { label: 'Trial conversions', value: '+12%', positive: true },
    conversation: [
      { from: 'agent', text: '"Subscribe now" converts 12% worse than "Start your box" in Hindi sessions. Proposed an Antigravity edit — routed to approval queue.', time: '13:15' },
      { from: 'agent', text: 'Discount ask from a bulk buyer (18%) exceeds margin floor. Escalated to Conflict Resolution with real margin data.', time: '13:40' },
    ],
  },
  {
    id: 'support',
    name: 'Support Agent',
    descriptor: 'First-layer customer support, any language',
    status: 'working',
    lastActivity: 'Answering delivery query in Hindi',
    stat: { label: 'Open tickets', value: '4' },
    conversation: [
      { from: 'agent', text: 'Resolved 9 tickets today. Languages: Hindi 5, Tamil 3, English 1. All answers grounded in the shared pricing/policy truth.', time: '14:02' },
      { from: 'agent', text: 'One refund request outside policy window — escalated to founder profile only (contains customer phone number, kept device-local).', time: '14:21' },
    ],
  },
]

export const conflicts: Conflict[] = [
  {
    id: 'c1',
    between: ['Brand & Marketing', 'Legal & Compliance'],
    topic: '"Certified organic" claim on the landing page',
    detail: 'Marketing drafted "certified organic" hero copy; FSSAI + Jaivik Bharat certification are not yet on file.',
    ruling: 'Claim blocked. Copy revised to "farm-traceable, chemical-free" until certification uploads to the vault.',
    status: 'resolved',
    time: 'Today 10:24',
  },
  {
    id: 'c2',
    between: ['Sales / GTM', 'Finance (Gemma-held)'],
    topic: '18% bulk discount vs. margin floor',
    detail: 'Requested discount takes gross margin below the 22% floor derived from ingested bank statements.',
    ruling: 'Arbitrating — counter-offer at 11% with a 6-month commitment drafted for founder review.',
    status: 'arbitrating',
    time: 'Today 13:42',
  },
  {
    id: 'c3',
    between: ['Antigravity edit', 'Legal & Compliance'],
    topic: 'Sales-proposed checkout copy adds "guaranteed delivery in 24h"',
    detail: 'Proposed edit introduces a delivery guarantee Legal has not cleared for all pin codes.',
    ruling: 'Edit held in approval queue; scoped to metro pin codes where the courier SLA supports it.',
    status: 'resolved',
    time: 'Yesterday 17:08',
  },
]

export const versions: Version[] = [
  {
    id: 'v6',
    label: 'v6 — draft',
    summary: 'Checkout CTA: "Subscribe now" → "Start your box" (Hindi + English)',
    source: 'Proposed by Sales Agent (conversion data)',
    time: 'Today 13:20',
    status: 'pending-approval',
  },
  {
    id: 'v5',
    label: 'v5 — live',
    summary: 'Pricing moved above the fold; Tamil toggle added to nav',
    source: 'Founder request (plain language)',
    time: 'Today 12:04',
    status: 'live',
  },
  {
    id: 'v4',
    label: 'v4',
    summary: 'Hero copy revised after Legal veto ("farm-traceable, chemical-free")',
    source: 'Conflict Resolution ruling',
    time: 'Today 10:30',
    status: 'previous',
  },
  {
    id: 'v3',
    label: 'v3',
    summary: 'Pongal campaign banner, Tamil locale variants',
    source: 'Brand Agent',
    time: 'Yesterday 16:12',
    status: 'previous',
  },
  {
    id: 'v2',
    label: 'v2',
    summary: 'FSSAI-safe ingredient descriptions across product pages',
    source: 'Legal & Compliance Agent',
    time: 'Yesterday 11:03',
    status: 'previous',
  },
]

export const vaultItems: VaultItem[] = [
  { id: 'm1', name: 'Validated market research', category: 'Research', scope: 'shared', syncState: 'synced' },
  { id: 'm2', name: 'Legal / compliance status', category: 'Legal', scope: 'shared', syncState: 'synced', derivedFact: 'GST registered, filings current' },
  { id: 'm3', name: 'Approved brand positioning', category: 'Brand', scope: 'shared', syncState: 'synced' },
  { id: 'm4', name: 'Live product & pricing state', category: 'Build', scope: 'shared', syncState: 'synced' },
  { id: 'm5', name: 'Bank statements (raw)', category: 'Financial', scope: 'local', syncState: 'device-only', derivedFact: 'Only "gross margin ~34%" synced' },
  { id: 'm6', name: 'ITR / GST filings (raw)', category: 'Financial', scope: 'local', syncState: 'device-only', derivedFact: 'Only status flag synced' },
  { id: 'm7', name: 'PAN / Aadhaar scans', category: 'Identity', scope: 'local', syncState: 'device-only', derivedFact: 'Never leaves this device' },
  { id: 'm8', name: 'Equity discussion notes', category: 'Personal', scope: 'local', syncState: 'device-only' },
]
