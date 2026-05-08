# AETHELGARD MERGED FILE
# Origin Repository: oh-my-claudecode-main
# Original Path: src\team\team-name.ts
# Merge Date: 2026-05-07T19:21:36.203308
# ---

const TEAM_NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/;

export function validateTeamName(teamName: string): string {
  if (!TEAM_NAME_PATTERN.test(teamName)) {
    throw new Error(
      `Invalid team name: "${teamName}". Team name must match /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/.`
    );
  }
  return teamName;
}
