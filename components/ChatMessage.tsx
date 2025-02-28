"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { ChatMessage as ChatMessageType } from "../types";
import ResultDisplay from "./ResultDisplay";

interface ChatMessageProps {
  message: ChatMessageType;
  onEdit: (id: string, newText: string) => void;
  isEditing: boolean;
  setEditingMessageId: (id: string | null) => void;
}

export default function ChatMessage({ message, onEdit, isEditing, setEditingMessageId }: ChatMessageProps) {
  const [editText, setEditText] = useState(message.text);
  const canEdit = Date.now() - message.timestamp < 5 * 60 * 1000; // 5 minutes

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(message.id, editText.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-gray-100 p-4 rounded-xl shadow-sm relative group"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
              onBlur={handleEditSubmit}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleEditSubmit())}
              autoFocus
            />
          ) : (
            <p className="text-gray-800">{message.text} {message.edited && <span className="text-gray-500 text-sm">(Edited)</span>}</p>
          )}
          {message.result && <ResultDisplay result={message.result} />}
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={() => setEditingMessageId(message.id)}
            className="opacity-0 group-hover:opacity-100 text-purple-600 hover:text-purple-800 transition"
          >
            <FaEdit />
          </button>
        )}
      </div>
      <p className="text-gray-500 text-xs mt-1">
        {new Date(message.timestamp).toLocaleTimeString()}
      </p>
    </motion.div>
  );
}