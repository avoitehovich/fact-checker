"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaComment } from "react-icons/fa";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback("");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaComment className="mr-2" /> Your Feedback
        </h2>
        <p className="mt-2 text-gray-700">Help us improve by sharing your thoughts:</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What do you think of the app? Any issues or suggestions?"
          className="w-full p-3 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={4}
        />
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex-1"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition flex-1"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}