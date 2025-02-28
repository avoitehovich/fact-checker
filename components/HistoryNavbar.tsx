"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaHistory, FaTrash } from "react-icons/fa";

interface HistoryNavbarProps {
  history: string[];
  isOpen: boolean;
  onToggle: () => void;
  onHistoryClick: (item: string) => void;
  onClearHistory: () => void;
  getHistoryIcon: (item: string) => React.ReactElement;
}

export default function HistoryNavbar({ history, isOpen, onToggle, onHistoryClick, onClearHistory, getHistoryIcon }: HistoryNavbarProps) {
  return (
    <>
      <div className="md:hidden bg-gradient-to-br from-purple-600 to-violet-600 text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold">Fact Checker</h1>
        <button onClick={onToggle} className="text-2xl">
          <FaHistory />
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white p-4 rounded-xl shadow-lg absolute top-16 left-4 right-4 z-10 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100"
        >
          <ul className="space-y-2">
            {history.length > 0 ? (
              history.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onHistoryClick(item)}
                  className="text-sm p-2 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-3 cursor-pointer"
                >
                  <div className="flex-shrink-0">{getHistoryIcon(item)}</div>
                  <span className="truncate">{item}</span>
                </motion.li>
              ))
            ) : (
              <li className="text-sm text-center text-gray-500 py-2">No history yet</li>
            )}
          </ul>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center w-full text-sm"
            >
              <FaTrash className="mr-2" /> Clear History
            </button>
          )}
        </motion.div>
      )}
    </>
  );
}