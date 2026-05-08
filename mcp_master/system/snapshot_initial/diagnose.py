#!/usr/bin/env python3
"""
MCP Diagnostic Tool
Diagnoses the MCP system and generates a report with findings and recommendations.
"""

import json
import os
import sys
from typing import Dict, List, Any, Optional
from datetime import datetime

class DiagnosticTool:
    def __init__(self, registry_path: str = "registry/tool_registry.json"):
        self.registry_path = registry_path
        self.registry = self._load_registry()
        self.findings = []
        self.recommendations = []

    def _load_registry(self) -> Dict:
        """Load the tool registry from JSON."""
        try:
            with open(self.registry_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            self.findings.append({
                "severity": "error",
                "message": f"Registry file not found at {self.registry_path}"
            })
            return {}
        except json.JSONDecodeError:
            self.findings.append({
                "severity": "error",
                "message": f"Invalid JSON in registry file {self.registry_path}"
            })
            return {}

    def run_diagnostics(self) -> Dict[str, Any]:
        """Run all diagnostic checks."""
        print("Running MCP diagnostics...")
        
        self._check_registry()
        self._check_tools()
        self._check_dependencies()
        self._check_configuration()
        self._check_performance()
        
        return self._generate_report()

    def _check_registry(self):
        """Check the tool registry."""
        print("Checking tool registry...")
        
        if not self.registry:
            self.findings.append({
                "severity": "error",
                "message": "Tool registry is empty or missing"
            })
            return
        
        # Check registry version
        version = self.registry.get("version")
        if not version:
            self.findings.append({
                "severity": "warning",
                "message": "Registry version is missing"
            })
        
        # Check last updated
        last_updated = self.registry.get("last_updated")
        if not last_updated:
            self.findings.append({
                "severity": "warning",
                "message": "Registry last_updated is missing"
            })
        
        # Check tools
        tools = self.registry.get("tools", {})
        if not tools:
            self.findings.append({
                "severity": "error",
                "message": "No tools found in registry"
            })
        
        print(f"Registry check complete: {len(tools)} tools found")

    def _check_tools(self):
        """Check individual tools."""
        print("Checking individual tools...")
        
        tools = self.registry.get("tools", {})
        for tool_name, tool_data in tools.items():
            # Check required fields
            required_fields = ["name", "description", "category", "keywords", "server", "args"]
            for field in required_fields:
                if field not in tool_data:
                    self.findings.append({
                        "severity": "error",
                        "message": f"Tool {tool_name} is missing required field: {field}"
                    })
            
            # Check performance metrics
            performance = tool_data.get("performance", {})
            if not performance:
                self.findings.append({
                    "severity": "warning",
                    "message": f"Tool {tool_name} is missing performance metrics"
                })
            
            # Check health status
            health = performance.get("health", "unknown")
            if health == "unhealthy":
                self.findings.append({
                    "severity": "error",
                    "message": f"Tool {tool_name} is unhealthy"
                })
            elif health == "degraded":
                self.findings.append({
                    "severity": "warning",
                    "message": f"Tool {tool_name} is degraded"
                })
        
        print(f"Tool check complete: {len(tools)} tools checked")

    def _check_dependencies(self):
        """Check system dependencies."""
        print("Checking dependencies...")
        
        # Check for required Python packages
        required_packages = ["json", "os", "sys", "typing", "datetime"]
        for package in required_packages:
            try:
                __import__(package)
            except ImportError:
                self.findings.append({
                    "severity": "error",
                    "message": f"Required package {package} is missing"
                })
        
        # Check for optional packages
        optional_packages = ["requests", "numpy", "pandas"]
        for package in optional_packages:
            try:
                __import__(package)
            except ImportError:
                self.findings.append({
                    "severity": "info",
                    "message": f"Optional package {package} is not installed"
                })
        
        print("Dependency check complete")

    def _check_configuration(self):
        """Check system configuration."""
        print("Checking configuration...")
        
        # Check for configuration files
        config_files = ["config/mcp_config.json", "package.json", "DEPENDENCIES.md"]
        for config_file in config_files:
            if not os.path.exists(config_file):
                self.findings.append({
                    "severity": "warning",
                    "message": f"Configuration file {config_file} is missing"
                })
        
        print("Configuration check complete")

    def _check_performance(self):
        """Check system performance."""
        print("Checking performance...")
        
        tools = self.registry.get("tools", {})
        for tool_name, tool_data in tools.items():
            performance = tool_data.get("performance", {})
            
            # Check success rate
            success_rate = performance.get("success_rate", 1.0)
            if success_rate < 0.80:
                self.findings.append({
                    "severity": "error",
                    "message": f"Tool {tool_name} has low success rate: {success_rate:.2f}"
                })
            elif success_rate < 0.95:
                self.findings.append({
                    "severity": "warning",
                    "message": f"Tool {tool_name} has suboptimal success rate: {success_rate:.2f}"
                })
            
            # Check usage count
            usage_count = performance.get("usage_count", 0)
            if usage_count == 0:
                self.findings.append({
                    "severity": "info",
                    "message": f"Tool {tool_name} has never been used"
                })
        
        print("Performance check complete")

    def _generate_report(self) -> Dict[str, Any]:
        """Generate a diagnostic report."""
        print("Generating diagnostic report...")
        
        # Categorize findings
        errors = [f for f in self.findings if f["severity"] == "error"]
        warnings = [f for f in self.findings if f["severity"] == "warning"]
        infos = [f for f in self.findings if f["severity"] == "info"]
        
        # Generate recommendations
        if errors:
            self.recommendations.append("Address all errors before proceeding")
        if warnings:
            self.recommendations.append("Review and address warnings for optimal performance")
        if not self.registry:
            self.recommendations.append("Rebuild the tool registry")
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_findings": len(self.findings),
                "errors": len(errors),
                "warnings": len(warnings),
                "infos": len(infos)
            },
            "findings": self.findings,
            "recommendations": self.recommendations,
            "status": "healthy" if not errors else "unhealthy"
        }
        
        print("Diagnostic report generated")
        return report

    def print_report(self, report: Dict[str, Any]):
        """Print the diagnostic report."""
        print("\n" + "="*50)
        print("MCP DIAGNOSTIC REPORT")
        print("="*50)
        print(f"Timestamp: {report['timestamp']}")
        print(f"Status: {report['status']}")
        print(f"\nSummary:")
        print(f"  Total Findings: {report['summary']['total_findings']}")
        print(f"  Errors: {report['summary']['errors']}")
        print(f"  Warnings: {report['summary']['warnings']}")
        print(f"  Infos: {report['summary']['infos']}")
        
        if report['findings']:
            print(f"\nFindings:")
            for finding in report['findings']:
                print(f"  [{finding['severity'].upper()}] {finding['message']}")
        
        if report['recommendations']:
            print(f"\nRecommendations:")
            for recommendation in report['recommendations']:
                print(f"  - {recommendation}")
        
        print("="*50)

if __name__ == "__main__":
    diagnostic = DiagnosticTool()
    report = diagnostic.run_diagnostics()
    diagnostic.print_report(report)