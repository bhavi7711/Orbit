/**
 * Minimal inline icon set (Lucide-style outline paths) so the dashboard
 * needs no icon dependency. Conventions from theme: stroke 1.75,
 * 20px nav / 16px inline, currentColor.
 */
import type { SVGProps } from 'react'

function base(props: SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 20, ...rest } = props
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...rest,
  } as const
}

export const GridIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const ScaleIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M12 3v18M5 7l7-2 7 2M3 12l2-5 2 5a3 3 0 0 1-4 0ZM17 12l2-5 2 5a3 3 0 0 1-4 0Z" />
  </svg>
)

export const HistoryIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 2.6-6.3L3 8" />
    <path d="M3 4v4h4M12 8v4l3 2" />
  </svg>
)

export const ShieldIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
  </svg>
)

export const SearchIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const GavelIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="m14 13-8.5 8.5a1.5 1.5 0 0 1-2-2L12 11M16 16l6-6M8 8l6-6M9 7l8 8M15 1.5 22.5 9" />
  </svg>
)

export const MegaphoneIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M3 11v3l14 4V7L3 11ZM17 7l4-2v14l-4-2M7 15v4a1 1 0 0 0 1 1h2" />
  </svg>
)

export const CodeIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
  </svg>
)

export const TrendingUpIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
  </svg>
)

export const HeadsetIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
    <rect x="2" y="14" width="5" height="6" rx="2" />
    <rect x="17" y="14" width="5" height="6" rx="2" />
  </svg>
)

export const CheckIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

export const XIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
)

export const LockIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const CloudIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M6 19a4 4 0 0 1-.5-7.97A6 6 0 0 1 17.2 9.6 4.5 4.5 0 0 1 17 19H6Z" />
  </svg>
)

export const RotateCcwIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 2.6-6.3L3 8M3 4v4h4" />
  </svg>
)

export const agentIcons: Record<string, typeof SearchIcon> = {
  research: SearchIcon,
  legal: GavelIcon,
  brand: MegaphoneIcon,
  build: CodeIcon,
  sales: TrendingUpIcon,
  support: HeadsetIcon,
}
