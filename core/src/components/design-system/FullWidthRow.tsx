# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\components\design-system\FullWidthRow.tsx
# Merge Date: 2026-05-07T19:21:50.085307
# ---

import * as React from 'react';
import { Box } from '../../ink.js';

type Props = {
  children: React.ReactNode;
};

export default function FullWidthRow({
  children
}: Props): React.ReactNode {
  return <Box flexDirection="row" width="100%">
      {children}
      <Box flexGrow={1} />
    </Box>;
}
