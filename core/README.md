# Aethelgard - Autonomous AI Agent Platform

## Overview

Aethelgard is a fully modular, self-improving AI agent platform capable of hunting, vetting, and integrating external agents/tools from GitHub. It features a dual-layer virus detection system, a GitHub agent hunter, and a unified orchestrator for managing tasks and capabilities.

## Features

- **GitHub Agent Hunter**: Discovers and analyzes repositories for new capabilities
- **Virus Detection**: Dual-layer security with signature and heuristic scanning
- **File Regeneration**: Automatically regenerates safe versions of infected files
- **Unified Orchestrator**: Manages memory, goals, and task queue
- **Safe Merge Engine**: Additive-only repository merging with syntax checking

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aethelgard

# Install dependencies
pip install -r requirements.txt
```

### Running Aethelgard

```bash
# Start the orchestrator
python core/main.py --mode orchestrator

# Run in interactive mode
python core/main.py --mode interactive

# Create and execute a task
python core/main.py --mode orchestrator --task "Search for AI agents" --capability search
```

## Architecture

```
core/
├── __init__.py          # Package initialization
├── main.py              # Entry point
├── orchestrator.py      # Central orchestrator
├── hunter/              # GitHub agent hunter
│   ├── __init__.py
│   ├── github_client.py
│   ├── analyzer.py
│   └── hunter.py
└── safety/              # Virus detection & regeneration
    ├── __init__.py
    ├── scanner.py
    ├── quarantine.py
    └── regenerator.py
```

## Safety

- All external code is scanned before analysis
- Infected files are quarantined with full logging
- System-critical files are preserved for human review
- Additive-only merge policy protects existing code

## License

MIT License
