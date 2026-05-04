<div align="center">
  
# 🚀 KRISHANA AI · *The Human-Like Real-Time Chat System*

### *"Where AI stops feeling like AI."*

<br>

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=500&color=6C63FF&center=true&vCenter=true&width=700&lines=Feels+Like+Talking+to+a+Real+Human;Emotionally+Intelligent+AI;Real-Time+Data+%2B+Gemini+AI;Multilingual+%7C+Context-Aware+%7C+Witty" />

<br>

[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tavily](https://img.shields.io/badge/Real--Time%20Data-Tavily-00C4B3?style=for-the-badge)](https://tavily.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br>

<img src="https://github.com/yadavabhi12/livechat-ai/blob/main/frontend/a1.png" width="85%" />
<!-- <img src="https://github.com/yadavabhi12/livechat-ai/blob/main/frontend/b.png" width="85%" /> -->

</div>

---

## 📌 Executive Summary

**KRISHANA AI** is not just a chatbot — it’s a **real-time conversational AI system** designed to simulate **human-like interaction** with emotional intelligence, contextual memory, and live data awareness.

Unlike basic AI apps, this system:
- Understands **conversation context**
- Adapts to **user tone & language**
- Fetches **real-time data intelligently**

> 💡 **Core Idea:** Combine AI + Real-time data + Human behavior simulation

---

## ✨ Key Features

- 🧠 **Context-Aware Memory**  
  Maintains conversation history (session-based)

- 💬 **Human-Like Responses**  
  Natural tone, emotions, humor, and conversational flow

- 🌐 **Real-Time Data Integration**  
  Uses Tavily API for live data (weather, news, etc.)

- 🔄 **Regenerate & Copy Features**  
  Re-generate responses or copy instantly

- 🌍 **Multilingual Support**  
  English, Hindi, Hinglish (auto-detection)

- ⚡ **Fast Performance**  
  Async architecture with low response latency

---

## 🏗️ System Architecture
<br>
<div  align="center">
<img    src="https://github.com/yadavabhi12/livechat-ai/blob/main/frontend/mermaid-diagram.png" width="80%" hieght="40%" />
</div>
<br/>


## 📂 Project Structure

```bash
livechat-ai/
│
├── backend/
│   ├── index.js        # Main server logic
│   ├── tavily.js       # Real-time search integration
│   └── .env
│
├── frontend/
│   ├── index.html      # UI structure
│   ├── style.css       # Design & responsiveness
│   └── script.js       # Chat logic & API calls
│
└── README.md

---

### ⚙️ Setup Instructions (Clean Version)

```markdown
## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yadavabhi12/livechat-ai.git
cd livechat-ai
### Backend Setup
cd backend
npm install

### Create .env file
GOOGLE_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
PORT=3000

### Run Server
npm run dev
