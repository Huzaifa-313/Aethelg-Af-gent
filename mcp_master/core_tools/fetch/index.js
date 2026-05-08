// MCP Standard Tool: Fetch
// Web fetch and scraping tool

const axios = require('axios');
const cheerio = require('cheerio');

// Tool implementation
const fetchUrl = async (url, format = 'text') => {
  try {
    const response = await axios.get(url);
    if (format === 'text') {
      return response.data;
    } else if (format === 'html') {
      return cheerio.load(response.data);
    } else if (format === 'markdown') {
      const $ = cheerio.load(response.data);
      $('script, style').remove();
      return $('body').text()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n');
    }
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
};

// MCP Tool Handler
module.exports = async (args) => {
  const { url, format = 'text' } = args;
  return await fetchUrl(url, format);
};