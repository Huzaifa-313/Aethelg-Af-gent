# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: anything-analyzer-main\src\renderer\ui\Tooltip.tsx
# Merge Date: 2026-05-07T19:29:19.174101
# ---

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Tooltip.module.css'

export interface TooltipProps {
  title: string
  children: React.ReactElement
}

export const Tooltip: React.FC<TooltipProps> = ({ title, children }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className={styles.tooltip}>{title}</div>}
    </div>
  )
}
