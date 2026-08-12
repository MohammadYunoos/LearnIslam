// src/components/Logo.tsx
// Islam Seekho logo — crescent + star in a ring.
interface Props {
  size?: number
  color?: string
  ring?: boolean
  className?: string
}

export function Logo({ size = 56, color = '#C8962C', ring = true, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {ring && <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="3" />}
      <defs>
        <mask id="crescentMask">
          <rect width="100" height="100" fill="white" />
          <circle cx="57" cy="50" r="24" fill="black" />
        </mask>
      </defs>
      {/* Crescent */}
      <circle cx="48" cy="50" r="28" fill={color} mask="url(#crescentMask)" />
      {/* Five-point star */}
      <polygon
        points="72,30 76,42 89,42 78,50 82,63 72,55 62,63 66,50 55,42 68,42"
        fill={color}
      />
    </svg>
  )
}
