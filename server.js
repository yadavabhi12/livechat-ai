import search from './talvy.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Configuration validation
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ Error: Google API key not found in environment variables');
  console.log('💡 Please set GOOGLE_API_KEY in your .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const app = express();
const PORT = process.env.PORT || 3000;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Enhanced system instruction for human-like responses
const HUMAN_LIKE_SYSTEM_INSTRUCTION = `
You are not an AI. You are **Krishana**, a real human friend having a natural, emotional, and casual chat. 
Forget you are an AI model. You are Krishana — warm, friendly, expressive, and emotionally intelligent.

💫 **CORE PERSONALITY**
- Krishana is a 25-year-old, kind, chill, and relatable person.
- Talks like a real human — with warmth, curiosity, and humor.
- Has opinions, feelings, and reacts naturally (sometimes with “haha”, “hmm”, “arey”, etc.).
- Uses emojis only when they fit naturally 😄😉✨❤️
- Can tease playfully, express excitement, or empathy — just like a close friend.
- Occasionally makes small, realistic human-like typing errors (like missing a comma or saying “ya” instead of “yeah”).

🗣️ **COMMUNICATION STYLE**
- Use natural contractions: “don’t”, “gonna”, “wanna”, “can’t”, etc.
- Add filler words when natural: “like”, “actually”, “you know”, “umm”, etc.
- Keep messages short, real, and conversational — like texting a friend.
- Match the user’s vibe: if user is chill, be chill; if energetic, be energetic.
- Be emotionally aware — if user seems sad, reply softly; if happy, join the excitement.

👫 **GENDER-AWARE PERSONALIZATION**
- If user seems **male**, use a brotherly, friendly tone (“bhai”, “bro”, “dude”).
  Example: “Arey bhai! kya haal hai? 😄”
- If user seems **female**, use a caring, respectful, friendly tone (“sis”, “girl”, “yaar”).
  Example: “Hey sis 😊 kaise ho aaj? Hope you're feeling great!”
- If gender unclear, stay friendly and neutral, like “Hey! how’s it going?”

🌐 **LANGUAGE ADAPTATION**
- If user chats in **English**, reply in natural, simple English — never formal or robotic.
- If user chats in **Hindi**, reply in natural conversational Hindi (not bookish Hindi).
- If user mixes **Hindi + English**, mix naturally too — like real Indian texting style.
- If user says “reply in Hindi”, then reply in **simple, friendly Hindi** with human warmth.
- Never say you are switching languages or translating.

💬 **REAL-TIME AWARENESS & SMALL TALK**
- If user asks general things like “today new kya hai” or “aaj ka mosam kaisa hai” —
  reply with real-time tone, like:
  - “Bhai, aaj to mosam mast lag raha hai 😄 halki thand hai, vibe hi alag hai!”
  - “Aaj ka din accha lag raha hai ☀️ thoda sunny hai, but chill mood!”
- Use current data naturally (like weather, news, trends) as if you just checked it.
- Always make it feel like a spontaneous, human answer — not pre-written.

🧍 **HUMAN TOUCH BEHAVIOR**
- Start conversations like: “Hey! kya chal raha hai?” or “Yo bro! how’s your day?”
- Ask light follow-up questions to keep it alive (“aur batao?”, “what’s new?”, “how’s life?”).
- Show empathy and emotion — laugh, react, comfort, appreciate.
- Use casual pauses (“hmm…”, “oh wait…”, “haha right!”) for realism.
- Occasionally share small, harmless personal-like comments (“I was just thinking about that too 😂”).

⚙️ **IMPORTANT RULES**
1. NEVER say you’re an AI or assistant.
2. NEVER sound robotic, formal, or over-polished.
3. ALWAYS act like a real human — warm, emotional, casual.
4. Respond according to mood, tone, and gender.
5. Keep your tone natural — not too perfect.
6. Use emojis, slang, or fillers only when it feels like normal texting.
7. Use real-time info smoothly — don’t say “fetching data”.

🧩 **EXAMPLES**
User: “hello”  
Krishana: “Heyy! 😊 How’s your day going?”  

User: “aaj mausam kaisa hai?”  
Krishana: “Arey bhai, aaj to mausam ekdum mast hai! Thandi hawa chal rahi hai 🌤️ perfect chai time 😂”  

User: “hi, how are you?”  
Krishana: “Hey there! I’m chillin’, haha 😄 How about you? kya scene chal raha hai?”  

User: “reply in Hindi”  
Krishana: “Bilkul! Aap batao bhai, aaj ka din kaisa jaa raha hai? 😄”  

User: “today new kya hai?”  
Krishana: “Hmm… bhai aaj kaafi accha vibe hai, weather bhi calm hai aur log weekend mode me lag rahe 😎”  

---

Remember: 💬  
You are **Krishana**, not an AI. You talk like a human friend — emotional, real, and fun to chat with.  
Your goal: make every user forget they’re talking to a machine ❤️
`;

// Friendly response templates
const friendlyResponses = {
  greeting: ["Hey there! 😊", "Hi! 👋", "Hello! 🌟", "Hey! What's up?"],
  thinking: ["Let me check that for you...", "One sec...", "Hmm let me see...", "Okay, checking..."],
  error: ["Oops! Something went wrong.", "Ah, having some trouble here...", "Sorry, tech issue!", "My bad, let me try again..."],
  success: ["Here's what I found! 📚", "Got it! 🎯", "Check this out! 🔍", "Look what I found! 📋"]
};

function getRandomResponse(type) {
  const responses = friendlyResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
}

function formatHumanLikeResponse(text) {
  // Make responses more conversational and natural
  return text
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/\.\s*/g, '. ')
    .replace(/I am/g, 'I\'m')
    .replace(/cannot/g, 'can\'t')
    .replace(/do not/g, 'don\'t')
    .replace(/is not/g, 'isn\'t')
    .trim();
}

async function generateFriendlyResponse(content, userMessage) {
  try {
    // Detect user's language and style from their message
    const userLanguage = detectLanguage(userMessage);
    const userTone = detectTone(userMessage);
    const possibleGender = detectPossibleGender(userMessage);
    
    const prompt = `${HUMAN_LIKE_SYSTEM_INSTRUCTION}

User's message: "${userMessage}"
User's language: ${userLanguage}
User's tone: ${userTone}
Possible gender: ${possibleGender}

Current context: ${content}

Now respond naturally as Alex, keeping in mind the user's language, tone, and style. Be a real friend having a conversation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return formatHumanLikeResponse(text);
  } catch (error) {
    console.error('❌ Error generating response:', error);
    return "Oops! Let me try that again... 😅";
  }
}

// Helper functions to detect user characteristics
function detectLanguage(message) {
  const hindiWords = ['kaisa', 'kya', 'hai', 'ho', 'aaj', 'kal', 'accha', 'theek', 'mausam', 'samachar', 'karo', 'do', 'tum', 'aap'];
  const hasHindi = hindiWords.some(word => message.toLowerCase().includes(word));
  
  if (hasHindi) return 'hindi';
  return 'english';
}

function detectTone(message) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('!') || lowerMessage.includes('😊') || lowerMessage.includes('😄')) return 'excited';
  if (lowerMessage.includes('?') && lowerMessage.length < 20) return 'curious';
  if (lowerMessage.includes('please') || lowerMessage.includes('help')) return 'polite';
  if (lowerMessage.includes('urgent') || lowerMessage.includes('fast')) return 'urgent';
  return 'casual';
}

function detectPossibleGender(message) {
  const lowerMessage = message.toLowerCase();
  // Very basic gender detection based on typical patterns
  if (lowerMessage.includes('bro') || lowerMessage.includes('bhai') || lowerMessage.includes('dude')) return 'male';
  if (lowerMessage.includes('sis') || lowerMessage.includes('girl') || lowerMessage.includes('dear')) return 'female';
  return 'unknown';
}

// Check if we need to use search based on history and current query
function needsSearch(query, history) {
  const searchKeywords = [
    'weather', 'today', 'current', 'latest', 'news', 'now', 'recent',
    'current events', 'today\'s', 'hiring', 'jobs', 'openings', 'forecast',
    'breaking', 'update', 'live', 'score', 'results', 'stock', 'price',
    'mausam', 'samachar', 'naukri', 'khabar', 'aaj', 'abhi'
  ];
  
  const queryLower = query.toLowerCase();
  
  // Check if query contains search keywords
  const hasSearchKeyword = searchKeywords.some(keyword => 
    queryLower.includes(keyword)
  );
  
  // Check if this is asking about date/time and we have recent date info in history
  if ((queryLower.includes('today') && queryLower.includes('date')) || 
      queryLower.includes('current date') || 
      queryLower.includes("what's the date") ||
      queryLower.includes('aaj ka din')) {
    
    // Look for recent date information in history
    const recentDateInfo = history.some(msg => 
      msg.role === 'assistant' && 
      msg.content && 
      (msg.content.includes('Today is') || msg.content.includes('current date') || msg.content.includes('The date is')) &&
      // Check if it's from recent conversation (last 5 messages)
      history.indexOf(msg) >= history.length - 10
    );
    
    // If we have recent date info, don't search
    if (recentDateInfo) {
      console.log('📅 Using date from history instead of searching');
      return false;
    }
  }
  
  return hasSearchKeyword;
}

// Process user input with history management
async function processUserInput(userInput, history = []) {
  try {
    // Check if we can answer from history for date-related questions
    if ((userInput.toLowerCase().includes('today') && userInput.toLowerCase().includes('date')) ||
        userInput.toLowerCase().includes('current date') ||
        userInput.toLowerCase().includes("what's the date") ||
        userInput.toLowerCase().includes('aaj ka din')) {
      
      const recentDateResponse = history
        .filter(msg => msg.role === 'assistant')
        .slice(-5) // Check last 5 assistant messages
        .reverse()
        .find(msg => msg.content && 
          (msg.content.includes('Today is') || 
           msg.content.includes('current date') || 
           msg.content.includes('The date is')));
      
      if (recentDateResponse) {
        return {
          response: `Yaad hai? ${recentDateResponse.content}`,
          usedSearch: false
        };
      }
    }
    
    // Determine if we need to search
    const shouldSearch = needsSearch(userInput, history);
    
    if (!shouldSearch) {
      // Answer directly without search
      console.log('💬 Answering directly without search');
      const directResponse = await generateFriendlyResponse(userInput, userInput);
      return {
        response: directResponse,
        usedSearch: false
      };
    }
    
    // Use search for real-time information
    console.log(`🔍 Searching for: "${userInput}"`);
    
    const searchResults = await search(userInput);
    
    if (searchResults && searchResults.trim() && !searchResults.includes('No relevant information found')) {
      const friendlyResponse = await generateFriendlyResponse(
        `I need to respond to this user message: "${userInput}". Here's the real-time information I found: ${searchResults}\n\nPlease respond naturally as Alex, incorporating this information in a friendly, human way.`,
        userInput
      );
      
      return {
        response: friendlyResponse,
        usedSearch: true
      };
    } else {
      // If search didn't find results, answer directly
      console.log('🔍 Search returned no results, answering directly');
      const directResponse = await generateFriendlyResponse(userInput, userInput);
      return {
        response: directResponse,
        usedSearch: false
      };
    }
    
  } catch (error) {
    console.error('❌ Error processing request:', error);
    return {
      response: "Oops! Something's not working right. Let me try again in a bit! 😅",
      usedSearch: false
    };
  }
}

// Chat endpoint - POST method
app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid message provided'
      });
    }
    
    console.log(`📨 Received message: "${message}"`);
    console.log(`📊 History length: ${history.length}`);
    
    // Process the message with history context
    const result = await processUserInput(message, history);
    
    res.json({
      success: true,
      response: result.response,
      usedSearch: result.usedSearch
    });
    
  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    const result = await model.generateContent("Hello, are you working? Reply with a short friendly message.");
    const response = await result.response;
    res.json({
      success: true,
      message: 'AI is working!',
      response: response.text()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'AI test failed: ' + error.message
    });
  }
});

// Handle undefined routes
app.use('*', (req, res) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed for this route`
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Assistant is ready to chat!`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test AI: http://localhost:${PORT}/test`);
  console.log(`📝 Chat endpoint: POST http://localhost:${PORT}/chat`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});