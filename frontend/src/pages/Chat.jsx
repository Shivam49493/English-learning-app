import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { userDataContext } from '../contexts/UserContext';
import { FaPaperPlane, FaUserCircle, FaGraduationCap, FaSpinner } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

const Chat = () => {
  const { userData } = useContext(userDataContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat stream
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch messages from backend
  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages`, {
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchMessages(true);

    // Setup polling every 3 seconds to get active student/teacher updates
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message send
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages`,
        { text: trimmed },
        { withCredentials: true }
      );

      // Append the sent message instantly to UI
      setMessages((prev) => [...prev, response.data]);
      setInputText('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-50/50">
        <FaSpinner className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Entering community chat...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-[90vh] flex flex-col font-sans">
      {/* Community Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-md">
        <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
          💬 Community Lounge
        </h2>
        <p className="text-indigo-100 text-sm md:text-base mt-2 max-w-2xl font-medium">
          Welcome to the Lernit discussion space! Chat with fellow students, ask questions, share helpful resources, and get advice from teachers.
        </p>
      </div>

      {/* Main Chat Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 h-[550px] overflow-hidden">

        {/* Chat Stream Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <span className="text-4xl">👋</span>
              <h3 className="text-lg font-bold text-gray-700 mt-2">No messages yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mt-1">
                Be the first to start the conversation! Type a message below.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === userData?._id;
              const isTeacher = msg.role === 'teacher';

              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* User Avatar */}
                    <div className="shrink-0 flex items-end">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                        isMe
                          ? 'bg-indigo-600 text-white'
                          : isTeacher
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}>
                        {msg.senderName.slice(0, 1).toUpperCase()}
                      </div>
                    </div>

                    {/* Message Bubble Container */}
                    <div className="flex flex-col">
                      {/* Name & Badge Row */}
                      <div className={`flex items-center gap-1.5 mb-1 text-xs ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-semibold text-gray-700">{msg.senderName}</span>
                        {isTeacher && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                            <FaGraduationCap /> Teacher
                          </span>
                        )}
                        {!isMe && !isTeacher && (
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-indigo-100">
                            Student
                          </span>
                        )}
                      </div>

                      {/* Actual Bubble */}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap break-words leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : isTeacher
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 text-gray-800 border border-amber-150 rounded-tl-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              maxLength={500}
              className="flex-1 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition duration-150 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white p-3.5 rounded-xl transition duration-150 shadow-md cursor-pointer shrink-0"
              aria-label="Send community message"
            >
              <FaPaperPlane className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Chat;
