# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: anything-analyzer-main\src\renderer\ui\Progress.tsx
# Merge Date: 2026-05-07T19:29:18.925104
# ---

import React from 'react'
import styles from './Progress.module.css'

export interface ProgressProps {
  percent: number
  status?: 'normal' | 'success' | 'error'
  showPercent?: boolean
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  percent,
  status = 'normal',
  showPercent = true,
  className,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent))

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <div className={styles.track}>
        <div
          className={`${styles.bar} ${status !== 'normal' ? styles[status] : ''}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {showPercent && <span className={styles.percent}>{Math.round(clampedPercent)}%</span>}
    </div>
  )
}
