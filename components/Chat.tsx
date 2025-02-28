"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaComment } from "react-icons/fa";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import FeedbackModal from "./FeedbackModal";
import EducationalResources from "./EducationalResources";
import { checkFacts } from "../services/api";
import { ChatMessage as ChatMessageType, FactCheckResult } from "../types";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMessages = localStorage.getItem("chatHistory");
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);

    const result = await checkFacts(text);
    if (result) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, result } : msg))
      );
      setAlert("Fact-check complete!");
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEditMessage = (id: string, newText: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, text: newText, edited: true, timestamp: Date.now() } : msg
      )
    );
    setEditingMessageId(null);
  };

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("User Feedback:", feedback);
    setAlert("Feedback submitted! Thank you!");
    setIsFeedbackOpen(false);
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 font-sans">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-6 text-center"
      >
        Fact Checker Chat
      </motion.h1>
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-10"
        >
          {alert}
        </motion.div>
      )}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onEdit={handleEditMessage}
            isEditing={editingMessageId === message.id}
            setEditingMessageId={setEditingMessageId}
          />
        ))}
        <EducationalResources />
      </div>
      <div className="mt-4 sticky bottom-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition"
      >
        <FaComment className="text-xl" />
      </button>
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}