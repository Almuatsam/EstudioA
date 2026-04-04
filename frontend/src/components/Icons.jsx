// Shared inline SVG icons — Heroicons 24 outline style
// Usage: <Icons.Pattern className="w-8 h-8" />

const defaults = { width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const PatternPlaceholder = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
  </svg>
)

export const Download = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
)

export const Heart = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

export const HeartSolid = ({ width = 24, height = 24, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={width} height={height} {...props}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
)

export const Warning = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
)

export const CheckCircle = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

export const XCircle = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

export const Users = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
)

export const Clock = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

export const BadgeCheck = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
)

// Category icons
export const Dress = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 3c0 0-2 2-4 3l-2 7h4l-1 8h6l-1-8h4l-2-7c-2-1-4-3-4-3Z" />
  </svg>
)

export const Shirt = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23Z" />
  </svg>
)

export const Scissors = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)

export const Bag = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export const Moon = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
)

export const Running = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="13" cy="4" r="1" />
    <path d="m7 21 2-7-2-3 5-2 2 4h4M9.5 9.5l1.5-3.5 3 1 2 3.5" />
  </svg>
)

export const Baby = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5.7 4.6 1.8" />
    <path d="M12 3c0-1.2.6-2 1-2" />
  </svg>
)

export const Pants = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M4 4h16v4l-4 12h-3l-1-8-1 8H8L4 8V4Z" />
  </svg>
)

export const Coat = (props) => (
  <svg {...defaults} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23Z" />
    <line x1="12" y1="2" x2="12" y2="10" />
  </svg>
)
