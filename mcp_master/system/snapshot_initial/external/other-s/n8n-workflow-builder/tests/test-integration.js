#!/usr/bin/env node

/**
 * Integration test to verify MCP server compatibility and tool availability
 */

const { spawn } = require('child_process');

class IntegrationTester {
  constructor() {
    this.serverProcess = null;
  }

  async startServer() {
    console.log('🚀 Starting n8n MCP server for integration test...');
    
    this.serverProcess = spawn('npx', ['.'], {
      cwd: '/Users/yasinboelhouwer/n8n-workflow-builder',
      env: {
        ...process.env,
        N8N_HOST: 'https://n8n.yasin.nu/api/v1',
        N8N_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMmE2NzM0NC05ZWI1LTQ0NmMtODczNi1lNWYyOGE4MjY4NTIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUzMzQzODU5fQ.PhpEIzzSGROy9Kok26SXmj9RRH1K3ArahexaVbQ2-Ho'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    return new Promise((resolve, reject) => {
      let output = '';
      
      this.serverProcess.stderr.on('data', (data) => {
        output += data.toString();
        if (output.includes('N8N Workflow Builder MCP server running on stdio')) {
          console.log('✅ Server started successfully');
          resolve();
        }
      });

      this.serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
        reject(error);
      });

      setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 10000);
    });
  }

  async sendMCPRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: method,
        params: params
      };

      let response = '';
      let timeout;

      const onData = (data) => {
        response += data.toString();
        try {
          const parsed = JSON.parse(response);
          clearTimeout(timeout);
          this.serverProcess.stdout.removeListener('data', onData);
          resolve(parsed);
        } catch (e) {
          // Continue collecting data
        }
      };

      this.serverProcess.stdout.on('data', onData);
      
      timeout = setTimeout(() => {
        this.serverProcess.stdout.removeListener('data', onData);
        reject(new Error(`Timeout waiting for response to ${method}`));
      }, 5000);

      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async testToolsAvailability() {
    console.log('🔍 Testing tools availability...');
    
    try {
      const response = await this.sendMCPRequest('tools/list');
      
      if (response.error) {
        console.log('❌ Failed to list tools:', response.error.message);
        return false;
      }
      
      const tools = response.result.tools || [];
      const expectedTools = [
        'list_workflows',
        'create_workflow',
        'get_workflow',
        'execute_workflow',
        'update_workflow',
        'activate_workflow',
        'deactivate_workflow',
        'delete_workflow',
        'create_workflow_and_activate'
      ];
      
      console.log(`📋 Found ${tools.length} tools:`);
      
      const availableToolNames = tools.map(tool => tool.name);
      const missingTools = expectedTools.filter(tool => !availableToolNames.includes(tool));
      const extraTools = availableToolNames.filter(tool => !expectedTools.includes(tool));
      
      expectedTools.forEach(toolName => {
        const isAvailable = availableToolNames.includes(toolName);
        console.log(`  ${isAvailable ? '✅' : '❌'} ${toolName}`);
      });
      
      if (extraTools.length > 0) {
        console.log('\n📎 Additional tools found:');
        extraTools.forEach(tool => console.log(`  ➕ ${tool}`));
      }
      
      if (missingTools.length === 0) {
        console.log('\n🎉 All expected tools are available!');
        return true;
      } else {
        console.log('\n❌ Missing tools:', missingTools);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error testing tools availability:', error.message);
      return false;
    }
  }

  async testMCPCompatibility() {
    console.log('\n🔧 Testing MCP protocol compatibility...');
    
    try {
      // Test initialize
      const initResponse = await this.sendMCPRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'integration-test',
          version: '1.0.0'
        }
      });
      
      if (initResponse.error) {
        console.log('❌ MCP initialize failed:', initResponse.error.message);
        return false;
      }
      
      console.log('✅ MCP initialize successful');
      
      // Test ping (if supported)
      try {
        const pingResponse = await this.sendMCPRequest('ping');
        if (!pingResponse.error) {
          console.log('✅ MCP ping successful');
        }
      } catch (e) {
        // Ping might not be supported, that's okay
        console.log('ℹ️  MCP ping not supported (optional)');
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ MCP compatibility test failed:', error.message);
      return false;
    }
  }

  async testBasicFunctionality() {
    try {
      // Test list_workflows
      const listResponse = await this.sendMCPRequest('tools/call', {
        name: 'list_workflows',
        arguments: {}
      });
      
      if (listResponse.error) {
        console.log('❌ Basic functionality test failed:', listResponse.error.message);
        return false;
      }
      
      console.log('✅ Basic functionality test passed');
      return true;
      
    } catch (error) {
      console.log('❌ Basic functionality test error:', error.message);
      return false;
    }
  }

  async runIntegrationTests() {
    try {
      await this.startServer();
      
      console.log('\n🧪 Running integration tests...\n');
      
      // Test 1: Tools availability
      const toolsAvailable = await this.testToolsAvailability();
      
      // Test 2: MCP compatibility
      const mcpCompatible = await this.testMCPCompatibility();
      
      // Test 3: Quick functional test
      console.log('\n⚡ Running quick functional test...');
      const functionalTest = await this.testBasicFunctionality();
      
      // Summary
      console.log('\n📊 Integration Test Results:');
      console.log('============================');
      console.log(`Tools Availability: ${toolsAvailable ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`MCP Compatibility: ${mcpCompatible ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Basic Functionality: ${functionalTest ? '✅ PASS' : '❌ FAIL'}`);
      
      const allPassed = toolsAvailable && mcpCompatible && functionalTest;
      
      if (allPassed) {
        console.log('\n🎉 All integration tests passed!');
        console.log('✅ Enhanced MCP server is fully compatible and functional');
        return true;
      } else {
        console.log('\n❌ Some integration tests failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Integration test execution failed:', error);
      return false;
    } finally {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.serverProcess) {
      console.log('\n🧹 Cleaning up server process...');
      this.serverProcess.kill();
    }
  }
}

// Run integration tests
const tester = new IntegrationTester();
tester.runIntegrationTests().then(success => {
  if (success) {
    console.log('\n🚀 Enhanced n8n-workflow-builder MCP server is ready for production!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Integration tests failed. Please review the issues above.');
    process.exit(1);
  }
}).catch(console.error);
