"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaComment, FaTwitter, FaYoutube, FaPodcast, FaImage, FaBook } from "react-icons/fa";
import FactCheckForm from "../components/FactCheckForm";
import HistorySidebar from "../components/HistorySidebar";
import HistoryNavbar from "../components/HistoryNavbar";
import ResultDisplay from "../components/ResultDisplay";
import FeedbackModal from "../components/FeedbackModal";
import EducationalResources from "../components/EducationalResources";
import { checkFacts, initializeOfflineCache } from "../services/api";
import { FactCheckResult } from "../types";

export default function Home() {
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedHistoryResult, setSelectedHistoryResult] = useState<FactCheckResult | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("factCheckHistory");
      setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      initializeOfflineCache();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && history.length > 0) {
      localStorage.setItem("factCheckHistory", JSON.stringify(history));
    }
  }, [history]);

  const handleFactCheck = async (input: string, inputType: string, imageFile: File | null) => {
    const factCheckResult = await checkFacts(input, inputType, imageFile, "en");
    if (factCheckResult) {
      setResult(factCheckResult);
      setHistory([input || "Image", ...history]);
      setAlert("Fact-check complete!");
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleHistoryClick = async (item: string) => {
    const result = await checkFacts(item, "text", null, "en");
    if (result !== undefined) {
      setSelectedHistoryResult(result);
      setIsHistoryOpen(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.setItem("factCheckHistory", JSON.stringify([]));
    }
    setAlert("History cleared!");
    setTimeout(() => setAlert(null), 3000);
  };

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("User Feedback:", feedback);
    setAlert("Feedback submitted! Thank you!");
    setIsFeedbackOpen(false);
    setTimeout(() => setAlert(null), 3000);
  };

  const getHistoryIcon = (item: string) => {
    if (item.includes("X post")) return <FaTwitter className="text-blue-400" />;
    if (item.includes("YouTube")) return <FaYoutube className="text-red-500" />;
    if (item.includes("Podcast")) return <FaPodcast className="text-green-500" />;
    if (item === "Image") return <FaImage className="text-purple-500" />;
    return <FaBook className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 font-sans">
      <HistoryNavbar
        history={history}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onHistoryClick={handleHistoryClick}
        onClearHistory={clearHistory}
        getHistoryIcon={getHistoryIcon}
      />
      <div className="flex flex-1 md:flex-row">
        <HistorySidebar
          history={history}
          onHistoryClick={handleHistoryClick}
          onClearHistory={clearHistory}
          getHistoryIcon={getHistoryIcon}
        />
        <div className="flex-1 max-w-full md:max-w-2xl relative">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:block text-3xl md:text-4xl font-extrabold text-purple-700 mb-6 text-center"
          >
            Fact Checker
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
          <FactCheckForm onFactCheck={handleFactCheck} />
          {result && <ResultDisplay result={result} />}
          <EducationalResources />
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
          {selectedHistoryResult && (
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
                className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">History Result</h2>
                <ResultDisplay result={selectedHistoryResult} />
                <button
                  onClick={() => setSelectedHistoryResult(null)}
                  className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}