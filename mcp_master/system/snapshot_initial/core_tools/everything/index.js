// MCP Standard Tool: Everything
// Universal file search tool using Everything (Windows)

const { exec } = require('child_process');
const path = require('path');

// Tool implementation
const searchFiles = async (query, limit = 10) => {
  return new Promise((resolve, reject) => {
    // Note: Requires Everything to be installed and running as a service
    const everythingCli = path.join(__dirname, 'bin', 'es.exe');
    const command = `${everythingCli} -n ${limit} "${query}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Everything search failed: ${stderr}`));
      } else {
        const results = stdout.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
        resolve(results);
      }
    });
  });
};

// MCP Tool Handler
module.exports = async (args) => {
  const { query, limit } = args;
  return await searchFiles(query, limit);
};