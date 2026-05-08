// MCP Standard Tool: Memory
// Memory management and recall for agents

class Memory {
  constructor() {
    this.store = new Map();
  }

  // Store a value in memory
  storeValue(key, value) {
    this.store.set(key, value);
    return { success: true, key };
  }

  // Recall a value from memory
  recallValue(key) {
    if (this.store.has(key)) {
      return { success: true, value: this.store.get(key) };
    } else {
      throw new Error(`Key ${key} not found in memory`);
    }
  }

  // List all keys in memory
  listKeys() {
    return Array.from(this.store.keys());
  }

  // Delete a key from memory
  deleteKey(key) {
    if (this.store.has(key)) {
      this.store.delete(key);
      return { success: true };
    } else {
      throw new Error(`Key ${key} not found in memory`);
    }
  }
}

// Singleton instance
const memory = new Memory();

// MCP Tool Handler
module.exports = async (toolName, args) => {
  switch (toolName) {
    case 'store':
      return memory.storeValue(args.key, args.value);
    case 'recall':
      return memory.recallValue(args.key);
    case 'list':
      return memory.listKeys();
    case 'delete':
      return memory.deleteKey(args.key);
    default:
      throw new Error(`Tool ${toolName} not found in Memory`);
  }
};