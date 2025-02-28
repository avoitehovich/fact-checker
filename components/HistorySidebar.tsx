"use client";

import React from "react"; // Add this
import { useState } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaTrash, FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface HistorySidebarProps {
  history: string[];
  onHistoryClick: (item: string) => void;
  onClearHistory: () => void;
  getHistoryIcon: (item: string) => React.ReactElement;
}

export default function HistorySidebar({ history, onHistoryClick, onClearHistory, getHistoryIcon }: HistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={{ width: isOpen ? "20rem" : "4rem" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="hidden md:block bg-gradient-to-br from-purple-600 to-violet-600 text-white p-4 rounded-xl shadow-lg h-[calc(100vh-2rem)] overflow-hidden md:mr-6 flex flex-col relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 text-2xl text-white"
      >
        {isOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>
      <div className="flex items-center justify-center mb-4">
        <FaHistory className="text-2xl" />
        {isOpen && <span className="ml-2 text-xl font-semibold">History</span>}
      </div>
      <div className={isOpen ? "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent" : "hidden"}>
        <ul className="space-y-2 w-full">
          {history.length > 0 ? (
            history.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onHistoryClick(item)}
                className="text-sm bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center space-x-3 cursor-pointer"
              >
                <div className="flex-shrink-0">{getHistoryIcon(item)}</div>
                <span className="truncate">{item}</span>
              </motion.li>
            ))
          ) : (
            <li className="text-sm text-center text-gray-200 py-2">No history yet</li>
          )}
        </ul>
      </div>
      {history.length > 0 && isOpen && (
        <button
          onClick={onClearHistory}
          className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center w-full text-sm"
        >
          <FaTrash className="mr-2" /> Clear History
        </button>
      )}
    </motion.div>
  );
}