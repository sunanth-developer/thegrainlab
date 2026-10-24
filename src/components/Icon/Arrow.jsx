export default function Arrow({ direction = 'right', size = 14 }) {
  const rotate = { right: 0, down: 90, left: 180, up: 270, 'up-right': -45 }[direction] ?? 0
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
