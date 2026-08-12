// src/components/Logo.tsx
// Islam Seekho logo — an open book rising into a mihrab arch, crescent + star above.
interface Props {
  size?: number
  color?: string
  ring?: boolean // kept for API compatibility; the arch acts as the frame
  className?: string
}

export function Logo({ size = 56, color = '#C8962C', className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <mask id="logoCrescentMask">
          <rect width="100" height="100" fill="white" />
          <circle cx="53" cy="40" r="10.5" fill="black" />
        </mask>
      </defs>

      {/* Mihrab arch */}
      <path
        d="M28 78 L28 48 Q28 24 50 15 Q72 24 72 48 L72 78"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Crescent + star inside the arch */}
      <circle cx="46" cy="41" r="13" fill={color} mask="url(#logoCrescentMask)" />
      <polygon
        points="63,27 65,33 72,33 66,37 68,44 63,40 58,44 60,37 54,33 61,33"
        fill={color}
      />

      {/* Open book at the base */}
      <path
        d="M50 70 C42 64 29 63 21 66 L21 84 C29 81 42 82 50 86 C58 82 71 81 79 84 L79 66 C71 63 58 64 50 70 Z"
        fill={color}
      />
      <path d="M50 70 L50 86" stroke="#0E3B36" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M27 71 C34 69 42 70 47 73" stroke="#0E3B36" strokeWidth="1.3" opacity="0.5" fill="none" />
      <path d="M53 73 C58 70 66 69 73 71" stroke="#0E3B36" strokeWidth="1.3" opacity="0.5" fill="none" />
    </svg>
  )
}
