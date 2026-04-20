import { useState, useRef, useEffect } from "react";
import "./EssayCheck.css";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Home",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1E47F7" : "none"}
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    key: "opportunities",
    label: "Opportunities",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
      </svg>
    ),
  },
  {
    key: "essay",
    label: "AI Chat",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1E47F7" : "none"}
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

const QUICK_PROMPTS = [
  "How do I write a strong motivation letter?",
  "What GPA do top universities require?",
  "How to prepare for SAT/IELTS?",
  "What extracurriculars help admissions?",
];

const SYSTEM_PROMPT = `You are Eduplat's expert university admissions advisor. You help students:
- Write and improve motivation letters and essays
- Understand university requirements (GPA, SAT, IELTS, TOEFL)
- Plan their extracurricular activities
- Choose the right universities for their profile
- Navigate the application process

Be concise, encouraging, and practical. Use bullet points when listing things.
Keep responses under 300 words unless asked for more detail.
Speak only in English.`;

export default function EssayCheck({ onNavigate }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Eduplat AI advisor 🎓\n\nI can help you with motivation letters, university requirements, application strategies, and any admissions questions. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const assistantText =
        data?.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "44px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleNav = (key) => { if (onNavigate) onNavigate(key); };

  const formatMessage = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <div className="essay-root">
      {/* Header */}
      <div className="essay-header">
        <div className="essay-logo"><span className="essay-logo-arrow">↗</span>Eduplat</div>
        <div className="essay-header-sub">AI Admissions Advisor</div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrap ${msg.role === "user" ? "chat-bubble-wrap--user" : ""}`}>
            {msg.role === "assistant" && (
              <div className="chat-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
            )}
            <div className={`chat-bubble ${msg.role === "user" ? "chat-bubble--user" : "chat-bubble--ai"}`}>
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-wrap">
            <div className="chat-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <div className="chat-bubble chat-bubble--ai chat-bubble--typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts – only at start */}
      {messages.length === 1 && !loading && (
        <div className="chat-quick-prompts">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button key={i} className="chat-quick-btn" onClick={() => sendMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask anything about universities, essays..."
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
        />
        <button
          className={`chat-send-btn ${(!input.trim() || loading) ? "chat-send-btn--disabled" : ""}`}
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${item.key === "essay" ? "bottom-nav-item--active" : ""}`}
            onClick={() => handleNav(item.key)}
          >
            {item.icon(item.key === "essay")}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}