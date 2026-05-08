# MCP Master Dependency Management

## Overview
This document outlines the dependency management strategy for the MCP Master toolkit. The goal is to ensure consistency, avoid version conflicts, and simplify dependency management across all tools.

## Root `package.json`
The root `package.json` defines common dependencies and resolutions for version conflicts. All tools should use the versions specified in the root `package.json` to maintain consistency.

### Common Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| `axios` | ^1.6.2 | HTTP requests |
| `cheerio` | ^1.0.0-rc.12 | HTML parsing |
| `express` | ^4.18.2 | Web server |
| `mongodb` | ^6.3.0 | MongoDB driver |
| `mongoose` | ^8.0.3 | MongoDB ODM |
| `playwright` | ^1.40.1 | Browser automation |
| `node-fetch` | ^3.3.2 | HTTP requests |
| `fs-extra` | ^11.1.1 | File system operations |
| `yaml` | ^2.3.4 | YAML parsing |

### Development Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| `typescript` | ^5.3.3 | TypeScript support |
| `jest` | ^29.7.0 | Testing |
| `eslint` | ^8.56.0 | Linting |
| `prettier` | ^3.1.1 | Code formatting |

## Tool-Specific Dependencies
Tools may have additional dependencies not listed in the root `package.json`. These should be documented in the tool's own `package.json` and should not conflict with the root dependencies.

## Version Conflict Resolution
The `resolutions` field in the root `package.json` is used to enforce specific versions of dependencies, even if transitive dependencies request different versions. This ensures consistency across the entire toolkit.

## Installation
To install dependencies for the entire toolkit, run:
```bash
npm install
```

To add a new dependency, use:
```bash
npm install <dependency> --save
```

## Updating Dependencies
Dependencies should be updated regularly to ensure security and compatibility. Use:
```bash
npm update
```

To update a specific dependency:
```bash
npm install <dependency>@latest --save
```

## Best Practices
- Always test tools after updating dependencies.
- Document any tool-specific dependencies in the tool's `README.md`.
- Avoid using `*` or overly permissive version ranges in `package.json`.