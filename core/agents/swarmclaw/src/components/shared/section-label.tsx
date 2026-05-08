# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

interface Props {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: Props) {
  return (
    <label className={`block font-display text-[12px] font-600 text-text-2 uppercase tracking-[0.08em] mb-3 ${className}`}>
      {children}
    </label>
  )
}
