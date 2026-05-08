#!/usr/bin/env python3
"""
MCP MASTER - MICRO-AGENT FACTORY
================================
Builds custom micro-agents and tools when no suitable tool
exists in the wild. Creates MCP-compliant tools from templates.

Responsibilities:
- Generate new tools from templates based on capability gaps
- Create MCP-compliant manifest files
- Build tool scaffolding with proper structure
- Register new tools in the ecosystem
"""

import json
import os
import sys
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class AgentSpec:
    """Specification for a new micro-agent."""
    name: str
    description: str
    category: str
    language: str  # 'python', 'javascript', 'typescript'
    capabilities: List[str]
    dependencies: List[str]
    created_at: str


class AgentFactory:
    """
    Micro-Agent Factory for the MCP Master ecosystem.
    
    Builds custom tools and micro-agents when no suitable
    tool exists in external repositories.
    """
    
    def __init__(self, config_path: str = "./ecosystem_config.yaml"):
        """Initialize the Agent Factory."""
        self.config = self._load_config(config_path)
        self.factory_config = self.config.get("agent_factory", {})
        self.master_dir = Path(self.config.get("paths", {}).get("master_dir", "./"))
        self.template_dir = Path(self.factory_config.get("template_dir", "./ecosystem/agent_templates"))
        
        # Ensure directories exist
        self.template_dir.mkdir(parents=True, exist_ok=True)
        
        print("[AgentFactory] Initialized")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f).get("ecosystem", {})
        except Exception as e:
            print(f"[AgentFactory] Warning: Could not load config: {e}")
            return {}
    
    def _generate_python_tool(self, spec: AgentSpec, output_dir: Path) -> bool:
        """Generate a Python-based MCP tool."""
        try:
            # Create directory structure
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate main tool file
            tool_py = output_dir / "tool.py"
            with open(tool_py, 'w') as f:
                f.write(f"\"\"\"\n")
                f.write(f"MCP Tool: {spec.name}\n")
                f.write(f"Description: {spec.description}\n")
                f.write(f"Generated: {spec.created_at}\n")
                f.write(f"\"\"\"\n\n")
                f.write("import json\n")
                f.write("import sys\n")
                f.write("from typing import Dict, Any\n\n")
                f.write("def handle_request(request: Dict[str, Any]) -> Dict[str, Any]:\n")
                f.write(f"    \"\"\"Handle incoming MCP request.\"\"\"\n")
                f.write(f"    method = request.get('method', '')\n")
                f.write(f"    params = request.get('params', {{}})\n\n")
                f.write(f"    # TODO: Implement tool logic\n")
                f.write(f"    return {{\n")
                f.write(f"        'jsonrpc': '2.0',\n")
                f.write(f"        'id': request.get('id'),\n")
                f.write(f"        'result': {{'status': 'ok'}}\n")
                f.write(f"    }}\n\n")
                f.write(f"if __name__ == '__main__':\n")
                f.write(f"    # Read JSON-RPC request from stdin\n")
                f.write(f"    request = json.loads(sys.stdin.readline())\n")
                f.write(f"    response = handle_request(request)\n")
                f.write(f"    print(json.dumps(response))\n")
            
            # Generate manifest
            manifest = {
                "name": spec.name,
                "description": spec.description,
                "version": "1.0.0",
                "language": "python",
                "entry_point": "tool.py",
                "capabilities": spec.capabilities,
                "dependencies": spec.dependencies,
                "mcp_version": "1.0"
            }
            
            manifest_file = output_dir / "manifest.json"
            with open(manifest_file, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            # Generate requirements.txt
            requirements = output_dir / "requirements.txt"
            with open(requirements, 'w') as f:
                for dep in spec.dependencies:
                    f.write(f"{dep}\n")
            
            print(f"[AgentFactory] Generated Python tool: {output_dir}")
            return True
            
        except Exception as e:
            print(f"[AgentFactory] Error generating Python tool: {e}")
            return False
    
    def _generate_javascript_tool(self, spec: AgentSpec, output_dir: Path) -> bool:
        """Generate a JavaScript-based MCP tool."""
        try:
            # Create directory structure
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate main tool file
            tool_js = output_dir / "index.js"
            with open(tool_js, 'w') as f:
                f.write(f"/**\n")
                f.write(f" * MCP Tool: {spec.name}\n")
                f.write(f" * Description: {spec.description}\n")
                f.write(f" * Generated: {spec.created_at}\n")
                f.write(f" */\n\n")
                f.write("const readline = require('readline');\n\n")
                f.write("function handleRequest(request) {\n")
                f.write("    const method = request.method;\n")
                f.write("    const params = request.params || {};\n\n")
                f.write("    // TODO: Implement tool logic\n")
                f.write("    return {\n")
                f.write("        jsonrpc: '2.0',\n")
                f.write("        id: request.id,\n")
                f.write("        result: { status: 'ok' }\n")
                f.write("    };\n")
                f.write("}\n\n")
                f.write("// Read JSON-RPC request from stdin\n")
                f.write("const rl = readline.createInterface({\n")
                f.write("    input: process.stdin,\n")
                f.write("    output: process.stdout\n")
                f.write("});\n\n")
                f.write("rl.on('line', (line) => {\n")
                f.write("    const request = JSON.parse(line);\n")
                f.write("    const response = handleRequest(request);\n")
                f.write("    console.log(JSON.stringify(response));\n")
                f.write("});\n")
            
            # Generate manifest
            manifest = {
                "name": spec.name,
                "description": spec.description,
                "version": "1.0.0",
                "language": "javascript",
                "entry_point": "index.js",
                "capabilities": spec.capabilities,
                "dependencies": spec.dependencies,
                "mcp_version": "1.0"
            }
            
            manifest_file = output_dir / "manifest.json"
            with open(manifest_file, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            # Generate package.json
            package_json = output_dir / "package.json"
            package_data = {
                "name": spec.name,
                "version": "1.0.0",
                "description": spec.description,
                "main": "index.js",
                "dependencies": {}
            }
            with open(package_json, 'w') as f:
                json.dump(package_data, f, indent=2)
            
            print(f"[AgentFactory] Generated JavaScript tool: {output_dir}")
            return True
            
        except Exception as e:
            print(f"[AgentFactory] Error generating JavaScript tool: {e}")
            return False
    
    def build_agent(self, name: str, description: str, category: str,
                   language: str = "python", capabilities: List[str] = None,
                   dependencies: List[str] = None) -> Dict:
        """
        Build a new micro-agent from specification.
        
        Args:
            name: Agent name
            description: Agent description
            category: Tool category
            language: Programming language ('python' or 'javascript')
            capabilities: List of capabilities
            dependencies: List of dependencies
            
        Returns:
            Build result with path and status
        """
        print(f"[AgentFactory] Building agent: {name}")
        
        spec = AgentSpec(
            name=name,
            description=description,
            category=category,
            language=language,
            capabilities=capabilities or [],
            dependencies=dependencies or [],
            created_at=datetime.now().isoformat()
        )
        
        # Determine output directory
        category_dir = self.master_dir / "custom_tools" / category
        output_dir = category_dir / name
        
        # Generate tool based on language
        if language == "python":
            success = self._generate_python_tool(spec, output_dir)
        elif language in ["javascript", "typescript"]:
            success = self._generate_javascript_tool(spec, output_dir)
        else:
            return {
                "success": False,
                "error": f"Unsupported language: {language}"
            }
        
        if success:
            return {
                "success": True,
                "agent_name": name,
                "path": str(output_dir),
                "language": language,
                "manifest": str(output_dir / "manifest.json")
            }
        else:
            return {
                "success": False,
                "error": "Failed to generate tool files"
            }
    
    def list_templates(self) -> List[str]:
        """List available agent templates."""
        templates = []
        if self.template_dir.exists():
            for item in self.template_dir.iterdir():
                if item.is_dir():
                    templates.append(item.name)
        return templates
    
    def get_factory_status(self) -> Dict:
        """Get factory status and statistics."""
        return {
            "templates_available": len(self.list_templates()),
            "template_dir": str(self.template_dir),
            "max_agents": self.factory_config.get("max_agents", 50)
        }


def main():
    """CLI entry point for the Agent Factory."""
    factory = AgentFactory()
    
    import argparse
    parser = argparse.ArgumentParser(description="MCP Master Agent Factory")
    parser.add_argument("command", choices=["build", "templates", "status"])
    parser.add_argument("--name", help="Agent name")
    parser.add_argument("--description", help="Agent description")
    parser.add_argument("--category", default="custom", help="Tool category")
    parser.add_argument("--language", choices=["python", "javascript"], default="python")
    parser.add_argument("--capabilities", help="Comma-separated capabilities")
    parser.add_argument("--dependencies", help="Comma-separated dependencies")
    
    args = parser.parse_args()
    
    if args.command == "build":
        if not args.name or not args.description:
            print("Error: --name and --description required")
            return
        
        capabilities = args.capabilities.split(",") if args.capabilities else []
        dependencies = args.dependencies.split(",") if args.dependencies else []
        
        result = factory.build_agent(
            name=args.name,
            description=args.description,
            category=args.category,
            language=args.language,
            capabilities=capabilities,
            dependencies=dependencies
        )
        print(json.dumps(result, indent=2))
    
    elif args.command == "templates":
        templates = factory.list_templates()
        print(f"Available templates: {templates}")
    
    elif args.command == "status":
        print(json.dumps(factory.get_factory_status(), indent=2))


if __name__ == "__main__":
    main()
