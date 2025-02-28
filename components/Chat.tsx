"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaComment } from "react-icons/fa";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import SessionList from "./SessionList";
import FeedbackModal from "./FeedbackModal";
import EducationalResources from "./EducationalResources";
import { checkFacts } from "../services/api";
import { ChatMessage as ChatMessageType, ChatSession } from "../types";

export default function Chat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessions = localStorage.getItem("chatSessions");
      console.log("Loading sessions from localStorage:", storedSessions);
      const parsedSessions = storedSessions ? JSON.parse(storedSessions) : [];
      console.log("Parsed sessions:", parsedSessions);
      setSessions(parsedSessions);
      if (parsedSessions.length > 0) {
        setCurrentSessionId(parsedSessions[0].id);
        console.log("Set current session ID:", parsedSessions[0].id);
      } else {
        const defaultSession: ChatSession = {
          id: "default",
          title: "Welcome Chat",
          messages: [{ id: "1", text: "Welcome to Fact Checker!", timestamp: Date.now() }],
          timestamp: Date.now(),
        };
        setSessions([defaultSession]);
        setCurrentSessionId(defaultSession.id);
        console.log("Initialized with default session:", defaultSession);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && sessions.length > 0) {
      console.log("Saving sessions to localStorage:", sessions);
      localStorage.setItem("chatSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleSendMessage = async (text: string) => {
    const timestamp = Date.now();
    const newMessage: ChatMessageType = { id: timestamp.toString(), text, timestamp };
    let sessionId = currentSessionId;

    if (!sessionId) {
      sessionId = timestamp.toString();
      setSessions((prev) => [
        { id: sessionId!, title: text.slice(0, 30) + (text.length > 30 ? "..." : ""), messages: [newMessage], timestamp },
        ...prev,
      ]);
      setCurrentSessionId(sessionId);
    } else {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, messages: [...session.messages, newMessage], timestamp }
            : session
        )
      );
    }

    setIsLoading(true);
    const result = await checkFacts(text);
    setIsLoading(false);

    if (result) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === newMessage.id ? { ...msg, result } : msg
                ),
              }
            : session
        )
      );
      setAlert("Fact-check complete!");
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEditMessage = (sessionId: string, messageId: string, newText: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: session.messages.map((msg) =>
                msg.id === messageId ? { ...msg, text: newText, edited: true, timestamp: Date.now() } : msg
              ),
            }
          : session
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

  const currentSession = sessions.find((session) => session.id === currentSessionId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 font-sans">
      <div className="flex flex-1 md:flex-row">
        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={(id) => setCurrentSessionId(id)}
        />
        <div className="flex-1 flex flex-col max-w-full md:max-w-[calc(100%-16rem)] relative"> {/* Adjust max-width for sidebar */}
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
              className="fixed top-4 md:top-16 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-10"
            >
              {alert}
            </motion.div>
          )}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100">
            {currentSession ? (
              <>
                {currentSession.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onEdit={(messageId, newText) => handleEditMessage(currentSession.id, messageId, newText)}
                    isEditing={editingMessageId === message.id}
                    setEditingMessageId={setEditingMessageId}
                  />
                ))}
                {isLoading && <div className="text-gray-500 italic mb-4">Typing...</div>}
              </>
            ) : (
              <div className="text-gray-500 text-center py-4">Select a session or start a new chat</div>
            )}
            <EducationalResources />
          </div>
          <div className="mt-4 sticky bottom-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
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