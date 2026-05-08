/**
 * Built-in skills that ship with the framework.
 * Includes /commit and /review skills for git operations.
 */

import { SkillDef, registerBuiltinSkill } from './loader';

/** Commit skill prompt */
const COMMIT_PROMPT = `
Review the current git state and create a well-structured commit.

## Steps
1. Run \`git status\` and \`git diff --staged\` to see what is staged.
- If nothing is staged, run \`git diff\` to see unstaged changes, then stage relevant files.

2. Analyze the changes:
- Summarize the nature of the change (feature, bug fix, refactor, docs, etc.)
- Write a concise commit title (≤72 chars) focusing on *why*, not just *what*.
- If multiple logical changes exist, ask the user whether to split them.

3. Create the commit:
\`\`\`
git commit -m "<title>"
\`\`\`
If additional context is needed, add a body separated by a blank line.

4. Print the commit hash and summary when done.

**Rules:**
- Never use \`--no-verify\`.
- Never commit files that likely contain secrets (.env, credentials, keys).
- Prefer imperative mood in the title: "Add X", "Fix Y", "Refactor Z".

User context: $ARGUMENTS
`;

/** Review skill prompt */
const REVIEW_PROMPT = `
Review the code or pull request and provide structured feedback.

## Steps
1. Understand the scope:
- If a PR number or URL is given in $ARGUMENTS, use \`gh pr view $ARGUMENTS --patch\` to get the diff.
- Otherwise, use \`git diff main...HEAD\` (or \`git diff HEAD~1\`) for local changes.

2. Analyze the diff:
- Correctness: Are there bugs, edge cases, or logic errors?
- Security: Injection, auth issues, exposed secrets, unsafe operations?
- Performance: N+1 queries, unnecessary allocations, blocking calls?
- Style: Does it follow existing conventions in the codebase?
- Tests: Are new behaviors tested? Do existing tests cover the change?

3. Write a structured review:
\`\`\`
## Summary
One-line overview of what the change does.

## Issues
- [CRITICAL/MAJOR/MINOR] Description and location

## Suggestions
- Nice-to-have improvements

## Verdict
APPROVE / REQUEST CHANGES / COMMENT
\`\`\`

4. If changes are needed, list specific file:line references.

User context: $ARGUMENTS
`;

/** Register built-in skills */
export function registerBuiltinSkills(): void {
  // /commit skill
  registerBuiltinSkill({
    name: 'commit',
    description: 'Review staged changes and create a well-structured git commit',
    triggers: ['/commit'],
    tools: ['Bash', 'Read'],
    prompt: COMMIT_PROMPT,
    filePath: '<builtin>',
    whenToUse: 'Use when the user wants to commit changes. Triggers: \'/commit\', \'commit changes\', \'make a commit\'.',
    argumentHint: '[optional context]',
    arguments: [],
    model: '',
    userInvocable: true,
    context: 'inline',
    source: 'builtin',
  });

  // /review skill
  registerBuiltinSkill({
    name: 'review',
    description: 'Review code changes or a pull request and provide structured feedback',
    triggers: ['/review', '/review-pr'],
    tools: ['Bash', 'Read', 'Grep'],
    prompt: REVIEW_PROMPT,
    filePath: '<builtin>',
    whenToUse: 'Use when the user wants a code review. Triggers: \'/review\', \'/review-pr\', \'review this PR\'.',
    argumentHint: '[PR number or URL]',
    arguments: ['pr'],
    model: '',
    userInvocable: true,
    context: 'inline',
    source: 'builtin',
  });
}