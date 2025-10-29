import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const apiKey = process.env.tavily;

if (!apiKey) {
  throw new Error("❌ Tavily API key not found. Please check your .env file and ensure TAVILY_API_KEY is set.");
}

// Initialize Tavily client
const tvly = tavily({ apiKey });

/**
 * Perform a web search using Tavily API
 * @param {string} query - The search query
 * @param {Object} options - Additional search options
 * @returns {Promise<string>} - Formatted search results
 */
async function search(query, options = {}) {
  // Validate input
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error("❌ Invalid search query. Please provide a non-empty string.");
  }

  const defaultOptions = {
    searchDepth: "advanced",
    includeImages: false,
    includeAnswer: true,
    includeRawContent: false,
    maxResults: 5,
    timeRange: "year"
  };

  const searchOptions = { ...defaultOptions, ...options };

  try {
    console.log(`🔍 Searching for: "${query}"`);
    
    const response = await tvly.search(query, searchOptions);
    
    if (!response || !response.results || response.results.length === 0) {
      return "No relevant information found for your search. You might want to try different keywords or check if your query is specific enough.";
    }

    // Format the results in a more readable way
    let formattedResults = "";
    
    response.results.forEach((result, index) => {
      formattedResults += `📖 Source ${index + 1}: ${result.title}\n`;
      formattedResults += `🔗 URL: ${result.url}\n`;
      formattedResults += `📝 Content: ${result.content}\n\n`;
    });

    // Include answer if available
    if (response.answer) {
      formattedResults = `💡 Quick Answer: ${response.answer}\n\n${formattedResults}`;
    }

    console.log(`✅ Found ${response.results.length} relevant results`);
    
    return formattedResults;

  } catch (error) {
    console.error('❌ Search API error:', error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      throw new Error("Authentication failed. Please check your Tavily API key.");
    } else if (error.message?.includes('rate limit')) {
      throw new Error("Search rate limit exceeded. Please try again in a moment.");
    } else if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
      throw new Error("Network error occurred. Please check your internet connection.");
    } else {
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}

// Enhanced search function with better error handling
async function enhancedSearch(query, options = {}) {
  const maxRetries = 2;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`🔄 Retry attempt ${attempt} for: "${query}"`);
        // Add delay between retries
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      return await search(query, options);
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Search attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }
}

export default enhancedSearch;