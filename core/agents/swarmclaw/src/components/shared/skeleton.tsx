# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

'use client'

interface Props {
  className?: string
  width?: string | number
  height?: string | number
}

export function Skeleton({ className = '', width, height }: Props) {
  return (
    <div
      className={`bg-white/[0.06] animate-pulse rounded ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}
