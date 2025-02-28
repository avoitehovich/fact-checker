"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaSearch, FaBars } from "react-icons/fa"; // Add FaBars for hamburger
import { ChatSession } from "../types";

interface SessionListProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
}

export default function SessionList({ sessions, currentSessionId, onSelectSession }: SessionListProps) {
  console.log("Rendering SessionList with sessions:", sessions);
  const [isOpen, setIsOpen] = useState(false); // For mobile dropdown
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((session) => {
    if (!session || !session.title || !session.messages) return false;
    const titleMatch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
    const messageMatch = session.messages.some((msg) =>
      msg.text ? msg.text.toLowerCase().includes(searchQuery.toLowerCase()) : false
    );
    return titleMatch || messageMatch;
  });

  return (
    <>
      {/* Mobile Navbar with Hamburger Menu */}
      <div className="md:hidden bg-gradient-to-br from-purple-600 to-violet-600 text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold">Fact Checker</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          <FaBars />
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white p-4 rounded-xl shadow-lg absolute top-16 left-4 right-4 z-10 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100"
        >
          <div className="flex items-center mb-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <ul className="space-y-2">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <li
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    setIsOpen(false);
                  }}
                  className={`text-sm p-2 rounded-lg cursor-pointer ${session.id === currentSessionId ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                >
                  {session.title}
                </li>
              ))
            ) : (
              <li className="text-sm text-center text-gray-500 py-2">No sessions found</li>
            )}
          </ul>
        </motion.div>
      )}

      {/* Desktop Sidebar (Always Visible) */}
      <div className="hidden md:block bg-gradient-to-br from-purple-600 to-violet-600 text-white p-4 rounded-xl shadow-lg h-[calc(100vh-2rem)] md:mr-6 flex flex-col w-64">
        <div className="flex items-center justify-center mb-4">
          <FaHistory className="text-2xl" />
          <span className="ml-2 text-xl font-semibold">Sessions</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
          <div className="flex items-center mb-2">
            <FaSearch className="text-gray-200 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
            />
          </div>
          <ul className="space-y-2">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <li
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`text-sm p-2 rounded-lg cursor-pointer ${session.id === currentSessionId ? "bg-purple-700" : "hover:bg-purple-500"}`}
                >
                  {session.title}
                </li>
              ))
            ) : (
              <li className="text-sm text-center text-gray-200 py-2">No sessions found</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}