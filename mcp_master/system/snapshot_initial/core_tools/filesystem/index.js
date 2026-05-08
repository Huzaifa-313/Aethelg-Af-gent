// MCP Standard Tool: Filesystem
// File system operations (read, write, list, delete)

const fs = require('fs').promises;
const path = require('path');

// Tool implementation
const readFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
};

const writeFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
};

const listFiles = async (dirPath, recursive = false) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (recursive) {
          files.push(...await listFiles(fullPath, recursive));
        }
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  } catch (error) {
    throw new Error(`Failed to list files in ${dirPath}: ${error.message}`);
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
  }
};

// MCP Tool Handler
module.exports = async (toolName, args) => {
  switch (toolName) {
    case 'read':
      return await readFile(args.filePath);
    case 'write':
      return await writeFile(args.filePath, args.content);
    case 'list':
      return await listFiles(args.dirPath, args.recursive || false);
    case 'delete':
      return await deleteFile(args.filePath);
    default:
      throw new Error(`Tool ${toolName} not found in Filesystem`);
  }
};