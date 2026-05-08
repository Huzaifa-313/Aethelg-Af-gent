# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

interface Props {
  size?: number
  className?: string
}

export function CheckIcon({ size = 14, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
