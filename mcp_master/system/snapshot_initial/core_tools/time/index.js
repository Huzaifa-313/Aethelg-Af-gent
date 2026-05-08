// MCP Standard Tool: Time
// Time and date utilities

// Tool implementation
const getCurrentTime = (timezone = 'UTC') => {
  try {
    const now = new Date();
    const options = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return now.toLocaleTimeString('en-US', options);
  } catch (error) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
};

const getCurrentDate = (timezone = 'UTC') => {
  try {
    const now = new Date();
    const options = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
  } catch (error) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
};

const getTimestamp = () => {
  return new Date().toISOString();
};

// MCP Tool Handler
module.exports = async (toolName, args) => {
  switch (toolName) {
    case 'current_time':
      return getCurrentTime(args.timezone || 'UTC');
    case 'current_date':
      return getCurrentDate(args.timezone || 'UTC');
    case 'timestamp':
      return getTimestamp();
    default:
      throw new Error(`Tool ${toolName} not found in Time`);
  }
};