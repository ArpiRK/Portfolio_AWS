import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Arpitha's AI assistant. Ask me anything about her experience, skills, or projects!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fitScore, setFitScore] = useState(null);
  const [sessionId] = useState(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: history.slice(0, -1),
          sessionId: sessionId
        }),
      });

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      if (data.fitScore) setFitScore(data.fitScore);

    } catch {
      setMessages([...updatedMessages, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again!",
      }]);
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

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>💬 Ask about Arpitha</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          {fitScore && (
            <div className="chatbot-fit-score">
              Job Fit Score: <strong>{fitScore}%</strong>
            </div>
          )}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.role}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message assistant">
                <span className="typing">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}