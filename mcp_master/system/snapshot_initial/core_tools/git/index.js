// MCP Standard Tool: Git
// Git operations (clone, commit, push, pull, branch)

const { exec } = require('child_process');
const path = require('path');

// Tool implementation
const gitClone = async (repoUrl, dirPath = null) => {
  return new Promise((resolve, reject) => {
    const command = dirPath ? `git clone ${repoUrl} ${dirPath}` : `git clone ${repoUrl}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git clone failed: ${stderr}`));
      } else {
        resolve({ success: true, output: stdout.trim() });
      }
    });
  });
};

const gitCommit = async (message, dirPath = '.') => {
  return new Promise((resolve, reject) => {
    const commands = [
      `cd ${dirPath}`,
      'git add .',
      `git commit -m "${message}"`
    ].join(' && ');
    
    exec(commands, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git commit failed: ${stderr}`));
      } else {
        resolve({ success: true, output: stdout.trim() });
      }
    });
  });
};

const gitPush = async (dirPath = '.') => {
  return new Promise((resolve, reject) => {
    const command = `cd ${dirPath} && git push`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git push failed: ${stderr}`));
      } else {
        resolve({ success: true, output: stdout.trim() });
      }
    });
  });
};

const gitPull = async (dirPath = '.') => {
  return new Promise((resolve, reject) => {
    const command = `cd ${dirPath} && git pull`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git pull failed: ${stderr}`));
      } else {
        resolve({ success: true, output: stdout.trim() });
      }
    });
  });
};

const gitBranch = async (dirPath = '.') => {
  return new Promise((resolve, reject) => {
    const command = `cd ${dirPath} && git branch -a`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git branch failed: ${stderr}`));
      } else {
        resolve(stdout.trim().split('\n').map(line => line.trim()));
      }
    });
  });
};

// MCP Tool Handler
module.exports = async (toolName, args) => {
  switch (toolName) {
    case 'clone':
      return await gitClone(args.repoUrl, args.dirPath || null);
    case 'commit':
      return await gitCommit(args.message, args.dirPath || '.');
    case 'push':
      return await gitPush(args.dirPath || '.');
    case 'pull':
      return await gitPull(args.dirPath || '.');
    case 'branch':
      return await gitBranch(args.dirPath || '.');
    default:
      throw new Error(`Tool ${toolName} not found in Git`);
  }
};