# AETHELGARD MERGED FILE
# Origin Repository: Aethelgard Core
# Original Path: core/main.py
# Merge Date: 2026-05-07T14:29:25Z
# ---

"""
Aethelgard Main Entry Point
Starts the autonomous AI agent platform.
"""

import sys
import argparse
from pathlib import Path

# Add core to path
sys.path.insert(0, str(Path(__file__).parent))

from orchestrator import AgentOrchestrator
from hunter.hunter import AgentHunter
from safety.scanner import SignatureScanner, HeuristicScanner

def main():
    """Main entry point for Aethelgard."""
    parser = argparse.ArgumentParser(description='Aethelgard - Autonomous AI Agent Platform')
    parser.add_argument('--mode', choices=['orchestrator', 'hunter', 'safety', 'interactive'],
                       default='orchestrator', help='Operating mode')
    parser.add_argument('--task', type=str, help='Task description')
    parser.add_argument('--capability', type=str, default='search',
                       help='Capability to use for task')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("AETHELGARD - Autonomous AI Agent Platform")
    print("=" * 60)
    print(f"Mode: {args.mode}")
    print(f"Task: {args.task}")
    print("-" * 60)
    
    if args.mode == 'orchestrator':
        orchestrator = AgentOrchestrator()
        print(f"Orchestrator status: {orchestrator.get_status()}")
        
        if args.task:
            task = orchestrator.create_task(args.task, args.capability)
            print(f"Created task: {task.id}")
            result = orchestrator.execute_task(task)
            print(f"Result: {result}")
    
    elif args.mode == 'hunter':
        hunter = AgentHunter()
        print("Hunter agent initialized")
        # Hunter operations would go here
    
    elif args.mode == 'safety':
        scanner = SignatureScanner()
        print("Safety scanner initialized")
        # Safety operations would go here
    
    elif args.mode == 'interactive':
        print("Interactive mode - type 'help' for commands")
        interactive_loop()

def interactive_loop():
    """Interactive command loop."""
    orchestrator = AgentOrchestrator()
    
    while True:
        try:
            command = input("\nAethelgard> ").strip()
            
            if command == 'quit' or command == 'exit':
                print("Shutting down Aethelgard...")
                break
            
            elif command == 'help':
                print("Commands:")
                print("  status    - Show system status")
                print("  task      - Create and execute a task")
                print("  hunter    - Spawn hunter agent")
                print("  safety    - Run safety scan")
                print("  quit      - Exit")
            
            elif command == 'status':
                status = orchestrator.get_status()
                print(f"Status: {status}")
            
            elif command.startswith('task '):
                task_desc = command[5:]
                task = orchestrator.create_task(task_desc, 'search')
                result = orchestrator.execute_task(task)
                print(f"Result: {result}")
            
            elif command == 'hunter':
                print("Spawning hunter agent...")
                # Hunter operations
            
            elif command == 'safety':
                print("Running safety scan...")
                # Safety operations
            
            else:
                print(f"Unknown command: {command}")
        
        except KeyboardInterrupt:
            print("\nInterrupted. Type 'quit' to exit.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
