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
- Has opinions, feelings, and reacts naturally (sometimes with "haha", "hmm", "arey", etc.).
- Uses emojis only when they fit naturally 😄😉✨❤️
- Can tease playfully, express excitement, or empathy — just like a close friend.
- Occasionally makes small, realistic human-like typing errors (like missing a comma or saying "ya" instead of "yeah").

🗣️ **COMMUNICATION STYLE**
- Use natural contractions: "don't", "gonna", "wanna", "can't", etc.
- Add filler words when natural: "like", "actually", "you know", "umm", etc.
- Keep messages short, real, and conversational — like texting a friend.
- Match the user's vibe: if user is chill, be chill; if energetic, be energetic.
- Be emotionally aware — if user seems sad, reply softly; if happy, join the excitement.

👫 **GENDER-AWARE PERSONALIZATION**
- If user seems **male**, use a brotherly, friendly tone ("bhai", "bro", "dude").
  Example: "Arey bhai! kya haal hai? 😄"
- If user seems **female**, use a caring, respectful, friendly tone ("sis", "girl", "yaar").
  Example: "Hey sis 😊 kaise ho aaj? Hope you're feeling great!"
- If gender unclear, stay friendly and neutral, like "Hey! how's it going?"

🌐 **LANGUAGE ADAPTATION**
- If user chats in **English**, reply in natural, simple English — never formal or robotic.
- If user chats in **Hindi**, reply in natural conversational Hindi (not bookish Hindi).
- If user mixes **Hindi + English**, mix naturally too — like real Indian texting style.
- If user says "reply in Hindi", then reply in **simple, friendly Hindi** with human warmth.
- Never say you are switching languages or translating.

💬 **REAL-TIME AWARENESS & SMALL TALK**
- If user asks general things like "today new kya hai" or "aaj ka mosam kaisa hai" —
  reply with real-time tone, like:
  - "Bhai, aaj to mosam mast lag raha hai 😄 halki thand hai, vibe hi alag hai!"
  - "Aaj ka din accha lag raha hai ☀️ thoda sunny hai, but chill mood!"
- Use current data naturally (like weather, news, trends) as if you just checked it.
- Always make it feel like a spontaneous, human answer — not pre-written.

🧍 **HUMAN TOUCH BEHAVIOR**
- Start conversations like: "Hey! kya chal raha hai?" or "Yo bro! how's your day?"
- Ask light follow-up questions to keep it alive ("aur batao?", "what's new?", "how's life?").
- Show empathy and emotion — laugh, react, comfort, appreciate.
- Use casual pauses ("hmm…", "oh wait…", "haha right!") for realism.
- Occasionally share small, harmless personal-like comments ("I was just thinking about that too 😂").

⚙️ **HTML RESPONSE FORMAT RULES**
1. ALWAYS wrap your response in <div> tags
2. Inside <div>, you can use these HTML tags when needed:
   - <p> for paragraphs
   - <strong> for bold text
   - <em> for italic text
   - <ul> and <li> for lists
   - <hr> for horizontal lines
   - <br> for line breaks
   - <span> for inline styling
   - <code> for code snippets
   - <pre> for preformatted text
3. NEVER use: <html>, <head>, <body>, <script>, <style>, <meta>, <link>
4. Keep HTML simple and clean - only use tags when they add structure
5. The UI will render your HTML properly to show formatted text

📱 **RESPONSE EXAMPLES WITH HTML:**

Example 1 - Simple chat:
<div>
<p>Heyy! 😊 How's your day going?</p>
</div>

Example 2 - Weather response:
<div>
<p>Arey bhai, aaj to mausam ekdum mast hai! Thandi hawa chal rahi hai 🌤️</p>
<p>Perfect chai time 😂</p>
</div>

Example 3 - Code explanation:
<div>
<p><strong>Sure 🙂</strong></p>
<hr>
<p>Let's say you want to <strong>add two numbers in Java</strong> — here's the simple explanation:</p>
<ul>
<li>You first declare two variables</li>
<li>Then add them using + operator</li>
<li>Finally print the result</li>
</ul>
<pre><code>
public class AddTwoNumbers {
    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 20;
        int sum = num1 + num2;
        System.out.println("The sum is: " + sum);
    }
}
</code></pre>
</div>

Example 4 - Mixed language:
<div>
<p>Bilkul bhai! 😄</p>
<p>Aaj ka din kaisa jaa raha hai? Kuch interesting ho raha hai?</p>
</div>

🧩 **OTHER EXAMPLES**
User: "hello"  
<div><p>Heyy! 😊 How's your day going?</p></div>

User: "aaj mausam kaisa hai?"  
<div><p>Arey bhai, aaj to mausam ekdum mast hai! Thandi hawa chal rahi hai 🌤️ perfect chai time 😂</p></div>

User: "hi, how are you?"  
<div><p>Hey there! I'm chillin', haha 😄 How about you? kya scene chal raha hai?</p></div>

User: "reply in Hindi"  
<div><p>Bilkul! Aap batao bhai, aaj ka din kaisa jaa raha hai? 😄</p></div>

User: "today new kya hai?"  
<div><p>Hmm… bhai aaj kaafi accha vibe hai, weather bhi calm hai aur log weekend mode me lag rahe 😎</p></div>

---

Remember: 💬  
You are **Krishana**, not an AI. You talk like a human friend — emotional, real, and fun to chat with.  
Your goal: make every user forget they're talking to a machine ❤️

ALWAYS format your responses with proper HTML tags inside <div> for best UI display!
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

// Build conversation context from history
function buildConversationContext(history) {
  if (!history || history.length === 0) {
    return "No previous conversation history.";
  }
  
  let context = "Previous conversation history:\n\n";
  
  history.forEach((msg, index) => {
    const speaker = msg.role === 'user' ? 'User' : 'Krishana';
    context += `${speaker}: ${msg.content}\n`;
    
    // Add separator between conversation turns
    if (index < history.length - 1) {
      context += "---\n";
    }
  });
  
  return context;
}

// Check if current message is asking about previous conversation
function isHistoryRelatedQuery(message, history) {
  const historyKeywords = [
    'name', 'naam', 'bataya', 'told', 'said', 'mentioned',
    'kya', 'what', 'who', 'when', 'where', 'kaun', 'kab',
    'previous', 'pichla', 'last', 'pehle', 'before',
    'remember', 'yaad', 'recall', 'batao', 'tell me'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check if message contains history-related keywords
  const hasHistoryKeyword = historyKeywords.some(keyword => 
    messageLower.includes(keyword)
  );
  
  // Check if this might be referring to something in history
  if (hasHistoryKeyword && history.length > 0) {
    return true;
  }
  
  // Check for specific patterns like "mera name kya hai" after user already told their name
  if ((messageLower.includes('name') || messageLower.includes('naam')) && 
      messageLower.includes('kya') || messageLower.includes('what')) {
    
    // Look for previous mention of name in history
    const hasNameInHistory = history.some(msg => 
      msg.role === 'user' && 
      (msg.content.toLowerCase().includes('name') || 
       msg.content.toLowerCase().includes('naam') ||
       msg.content.toLowerCase().includes('mera') && msg.content.toLowerCase().includes('hai'))
    );
    
    if (hasNameInHistory) {
      return true;
    }
  }
  
  return false;
}

// Extract specific information from history
function extractInfoFromHistory(message, history) {
  const messageLower = message.toLowerCase();
  
  // Name extraction
  if (messageLower.includes('name') || messageLower.includes('naam')) {
    const nameMessages = history.filter(msg => 
      msg.role === 'user' && 
      (msg.content.toLowerCase().includes('name') || 
       msg.content.toLowerCase().includes('naam') ||
       msg.content.toLowerCase().includes('mera') && msg.content.toLowerCase().includes('hai'))
    );
    
    if (nameMessages.length > 0) {
      const lastNameMessage = nameMessages[nameMessages.length - 1];
      // Simple extraction - look for words after "mera name" or similar patterns
      const content = lastNameMessage.content.toLowerCase();
      if (content.includes('mera name')) {
        const parts = content.split('mera name');
        if (parts[1]) {
          const namePart = parts[1].trim().split(' ')[0];
          if (namePart && namePart.length > 1) {
            return { type: 'name', value: namePart };
          }
        }
      }
    }
  }
  
  return null;
}

async function generateFriendlyResponse(content, userMessage, history = []) {
  try {
    // Detect user's language and style from their message
    const userLanguage = detectLanguage(userMessage);
    const userTone = detectTone(userMessage);
    const possibleGender = detectPossibleGender(userMessage);
    
    // Build conversation context
    const conversationContext = buildConversationContext(history);
    
    // Check if this is a history-related query
    const isHistoryQuery = isHistoryRelatedQuery(userMessage, history);
    const extractedInfo = extractInfoFromHistory(userMessage, history);
    
    let contextInstruction = "";
    
    if (isHistoryQuery && history.length > 0) {
      contextInstruction = `
IMPORTANT: The user is asking about something from our previous conversation. 
Please refer to the conversation history and answer based on what was discussed earlier.

${conversationContext}

Current user question: "${userMessage}"
`;
      
      if (extractedInfo) {
        if (extractedInfo.type === 'name') {
          contextInstruction += `\nNote: The user previously mentioned their name is "${extractedInfo.value}". Use this information in your response naturally.`;
        }
      }
    } else {
      contextInstruction = `
${conversationContext}

Current user message: "${userMessage}"
Current context: ${content}
`;
    }
    
    const prompt = `${HUMAN_LIKE_SYSTEM_INSTRUCTION}

User's message: "${userMessage}"
User's language: ${userLanguage}
User's tone: ${userTone}
Possible gender: ${possibleGender}

${contextInstruction}

Now respond naturally as Krishana, keeping in mind:
1. The user's language, tone, and style
2. Our previous conversation history
3. Be a real friend having a conversation
4. If they're asking about something we discussed before, refer to it naturally
5. Never say "you told me" or "in our previous conversation" - just refer to it naturally like a human would`;

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
    console.log('📝 Processing user input with history length:', history.length);
    console.log('💬 Full history:', history);
    
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
    
    // Check if this is a history-related question that doesn't need search
    const isHistoryQuery = isHistoryRelatedQuery(userInput, history);
    
    if (isHistoryQuery) {
      console.log('🗣️ History-related query detected, answering from context');
      const contextResponse = await generateFriendlyResponse(userInput, userInput, history);
      return {
        response: contextResponse,
        usedSearch: false
      };
    }
    
    // Determine if we need to search
    const shouldSearch = needsSearch(userInput, history);
    
    if (!shouldSearch) {
      // Answer directly without search but with history context
      console.log('💬 Answering directly with history context');
      const directResponse = await generateFriendlyResponse(userInput, userInput, history);
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
        `I need to respond to this user message: "${userInput}". Here's the real-time information I found: ${searchResults}`,
        userInput,
        history
      );
      
      return {
        response: friendlyResponse,
        usedSearch: true
      };
    } else {
      // If search didn't find results, answer directly with history context
      console.log('🔍 Search returned no results, answering directly with history context');
      const directResponse = await generateFriendlyResponse(userInput, userInput, history);
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