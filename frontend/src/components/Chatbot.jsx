import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaChevronDown } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 Hi there! Welcome to Lernit! I am your student assistant. How can I help you learn English today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested questions for quick actions
  const suggestions = [
    "What can I learn here?",
    "How does the quiz work?",
    "Meaning of book",
    "How do I practice sentences?",
    "Grammar Quick Guide",
    "Pronunciation tips",
  ];

  // Scroll to bottom whenever messages list updates or is opened
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText) return;

    // Add user message to state
    const userMessage = {
      id: Date.now() + "-user",
      sender: "user",
      text: trimmedText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        query: trimmedText,
      });

      const botReply = {
        id: Date.now() + "-bot",
        sender: "bot",
        text: response.data.reply,
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Error communicating with chatbot backend:", err);
      const errorReply = {
        id: Date.now() + "-bot-error",
        sender: "bot",
        text: "❌ Sorry, I'm having trouble connecting to the server. Please try again later.",
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  // Utility to parse basic Markdown formatting (bold, list points, newlines)
  const formatMessageText = (text) => {
    return text.split("\n").map((line, index) => {
      // Handle bold text like **text**
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-bold text-indigo-950">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const finalLine = parts.length > 0 ? parts : formattedLine;

      // Handle custom indentation or styling for bullet list items
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <div key={index} className="pl-4 py-0.5 flex items-start">
            <span className="mr-2 text-indigo-500">•</span>
            <span className="flex-1">{finalLine.toString().replace(/^[•-]\s*/, "")}</span>
          </div>
        );
      }

      return (
        <p key={index} className={line.trim() === "" ? "h-2" : "py-0.5 min-h-[1.2rem]"}>
          {finalLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          title="Ask Lernit Chatbot"
          aria-label="Open Lernit Chatbot"
        >
          <FaComments className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col w-[350px] md:w-[400px] h-[550px] transition duration-300 transform scale-100 origin-bottom-right">
          {/* Chat Header */}
          <div className="bg-indigo-600 rounded-t-2xl p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Lernit Assistant</h3>
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  <span className="text-xs text-indigo-100 font-medium">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition duration-200"
                title="Minimize chatbot"
                aria-label="Minimize chatbot"
              >
                <FaChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="space-y-1">{formatMessageText(msg.text)}</div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center space-x-1">
                  <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestions */}
          <div className="px-4 py-2 bg-white border-t border-gray-50 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                disabled={isLoading}
                className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100 transition duration-150 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Form Footer */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition duration-150 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white p-3 rounded-xl transition duration-150 shadow-md cursor-pointer"
                aria-label="Send message"
              >
                <FaPaperPlane className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
