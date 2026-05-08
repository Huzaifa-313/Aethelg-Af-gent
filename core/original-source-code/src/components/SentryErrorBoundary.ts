# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\components\SentryErrorBoundary.ts
# Merge Date: 2026-05-07T19:19:14.969687
# ---

import * as React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class SentryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}
