"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message to fact-check..."
        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        rows={1}
        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())}
      />
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition"
      >
        <FaSearch />
      </button>
    </div>
  );
}