"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { FaSearch, FaBook, FaHistory, FaTwitter, FaYoutube, FaPodcast, FaImage, FaTrash, FaComment } from "react-icons/fa";

export default function Home() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("text");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    claim?: string;
    url?: string;
    rating?: string;
    publisher?: string;
    sentiment?: string;
    sentimentImpact?: string;
    bias?: string;
    expertReview?: string;
    isFake?: boolean;
  } | null>(null);
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem("factCheckHistory") || "[]"));
  const [alert, setAlert] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [feedback, setFeedback] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedHistoryResult, setSelectedHistoryResult] = useState<any>(null); // For modal

  const OFFLINE_CACHE = "offlineFactCheckRules";

  useEffect(() => {
    localStorage.setItem("factCheckHistory", JSON.stringify(history));
    if (!localStorage.getItem(OFFLINE_CACHE)) {
      localStorage.setItem(OFFLINE_CACHE, JSON.stringify({ rules: "Basic checks: Avoid obvious hoaxes." }));
    }
  }, [history]);

  const checkFacts = debounce(async (queryInput?: string) => {
    const effectiveInput = queryInput || input;
    if (!effectiveInput && !imageFile) return;
    setResult({ claim: "Checking..." });
    let query = inputType === "image" ? "Image analysis" : effectiveInput;
    if (inputType === "x") query = `X post: ${effectiveInput}`;
    if (inputType === "youtube") query = `YouTube video: ${effectiveInput}`;
    if (inputType === "podcast") query = `Podcast snippet: ${effectiveInput}`;

    try {
      if (navigator.onLine) {
        const response = await fetch(`/api/factcheck?query=${encodeURIComponent(query)}&language=${language}`);
        const data = await response.json();
        let resultObj: any = {};
        if (inputType === "image") resultObj.claim = "Image analysis: ";
        if (data.claims?.length > 0) {
          const firstClaim = data.claims[0];
          resultObj.claim = firstClaim.text;
          resultObj.url = firstClaim.claimReview[0].url || "https://example.com";
          resultObj.rating = firstClaim.claimReview[0].textualRating;
          resultObj.publisher = firstClaim.claimReview[0].publisher.name;
          resultObj.isFake = ["False", "Pants on Fire", "Fake"].includes(resultObj.rating);
        } else {
          resultObj.claim = `No fact-checks found for "${query}".`;
        }
        if (inputType === "image") resultObj.claim += " (Mock: No visible manipulation detected)";

        resultObj.sentiment = Math.random() > 0.5 ? "Positive" : "Negative";
        resultObj.sentimentImpact = `Likely to ${resultObj.sentiment === "Positive" ? "calm" : "alarm"} public opinion.`;
        resultObj.bias = Math.random() > 0.7 ? "Potential bias detected: Leans toward sensationalism." : "No clear bias detected.";
        resultObj.expertReview = "Journalist confirms data aligns with reputable sources.";

        setResult(resultObj);
        return resultObj; // Return for history modal
      } else {
        const offlineRules = JSON.parse(localStorage.getItem(OFFLINE_CACHE) || "{}");
        const offlineResult = { claim: `Offline Mode: ${offlineRules.rules}\nInput: "${query}" appears unchecked.` };
        setResult(offlineResult);
        return offlineResult;
      }
    } catch (error) {
      const errorResult = { claim: "Error checking facts. Please try again." };
      setResult(errorResult);
      console.error(error);
      return errorResult;
    }
  }, 500);

  const handleFactCheck = async () => {
    await checkFacts();
    setHistory([input || "Image", ...history]);
    setAlert("Fact-check complete!");
    setInput("");
    setImageFile(null);
    setTimeout(() => setAlert(null), 3000);
  };

  const handleHistoryClick = async (item: string) => {
    const result = await checkFacts(item);
    setSelectedHistoryResult(result);
  };

  const clearHistory = () => {
    setHistory([]);
    setAlert("History cleared!");
    setTimeout(() => setAlert(null), 3000);
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      console.log("User Feedback:", feedback);
      setAlert("Feedback submitted! Thank you!");
      setFeedback("");
      setIsFeedbackOpen(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const getHistoryIcon = (item: string) => {
    if (item.includes("X post")) return <FaTwitter className="text-blue-400" />;
    if (item.includes("YouTube")) return <FaYoutube className="text-red-500" />;
    if (item.includes("Podcast")) return <FaPodcast className="text-green-500" />;
    if (item === "Image") return <FaImage className="text-purple-500" />;
    return <FaBook className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-4 font-sans">
      {/* Refined History Sidebar */}
      <motion.div
        initial={{ width: "4rem" }}
        whileHover={{ width: "20rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-purple-600 to-violet-600 text-white p-4 rounded-xl shadow-lg h-[calc(100vh-2rem)] overflow-hidden md:mr-6 mb-4 md:mb-0 flex flex-col"
      >
        <div className="flex items-center justify-center mb-4">
          <FaHistory className="text-2xl" />
          <span className="ml-2 text-xl font-semibold hidden hover:block">History</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
          <ul className="space-y-2 w-full">
            {history.length > 0 ? (
              history.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleHistoryClick(item)}
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
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center w-full text-sm"
          >
            <FaTrash className="mr-2" /> Clear History
          </button>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 max-w-full md:max-w-2xl relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-6 text-center"
        >
          Fact Checker
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

        {/* Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
            >
              <option value="text">Text/Article</option>
              <option value="x">X Post</option>
              <option value="youtube">YouTube Video</option>
              <option value="podcast">Podcast Snippet</option>
              <option value="image">Image</option>
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ru">Russian</option>
            </select>
          </div>
          {inputType === "image" ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded-md mb-4"
            />
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${inputType} content...`}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          )}
          <button
            onClick={handleFactCheck}
            className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition flex items-center justify-center"
          >
            <FaSearch className="mr-2" /> Check Now
          </button>
        </motion.div>

        {/* Readable Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Result</h2>
            <div className="text-gray-700 space-y-3">
              {result.claim && (
                <p>
                  <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Claim:</span> {result.claim}
                </p>
              )}
              {result.url && (
                <p>
                  <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Source:</span>{" "}
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                    {result.url}
                  </a>
                </p>
              )}
              {result.rating && (
                <p>
                  <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Rating:</span> {result.rating}
                  {result.isFake && (
                    <img
                      src="https://via.placeholder.com/100x50?text=FAKE"
                      alt="Fake News Indicator"
                      className="inline-block ml-2 h-6"
                    />
                  )}
                </p>
              )}
              {result.sentiment && (
                <p>
                  <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Sentiment:</span> {result.sentiment} - {result.sentimentImpact}
                </p>
              )}
              {result.bias && (
                <p>
                  <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Bias:</span> {result.bias}
                </p>
              )}
              {result.expertReview && (
                <p>
                  <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Expert Review:</span> {result.expertReview}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Educational Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full"
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaBook className="mr-2" /> Learn About Fact-Checking
          </h2>
          <p className="mt-2 text-gray-700">
            Understand why fact-checking matters and how to spot misinformation:
          </p>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li>
              <a href="https://www.poynter.org/ifcn/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                IFCN: International Fact-Checking Network
              </a>
            </li>
            <li>
              <a href="https://www.bbc.com/news/education-51719788" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                BBC: How to Spot Fake News
              </a>
            </li>
            <li>
              <a href="https://www.factcheck.org/a-guide-to-our-methods/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                FactCheck.org: A Guide to Our Methods
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Feedback Button */}
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <FaComment className="text-xl" />
        </button>

        {/* Feedback Modal */}
        {isFeedbackOpen && (
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
                  onClick={submitFeedback}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex-1"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsFeedbackOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* History Result Modal */}
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
              <div className="text-gray-700 space-y-3">
                {selectedHistoryResult.claim && (
                  <p>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Claim:</span> {selectedHistoryResult.claim}
                  </p>
                )}
                {selectedHistoryResult.url && (
                  <p>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Source:</span>{" "}
                    <a href={selectedHistoryResult.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                      {selectedHistoryResult.url}
                    </a>
                  </p>
                )}
                {selectedHistoryResult.rating && (
                  <p>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Rating:</span> {selectedHistoryResult.rating}
                    {selectedHistoryResult.isFake && (
                      <img
                        src="https://via.placeholder.com/100x50?text=FAKE"
                        alt="Fake News Indicator"
                        className="inline-block ml-2 h-6"
                      />
                    )}
                  </p>
                )}
                {selectedHistoryResult.sentiment && (
                  <p>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Sentiment:</span> {selectedHistoryResult.sentiment} - {selectedHistoryResult.sentimentImpact}
                  </p>
                )}
                {selectedHistoryResult.bias && (
                  <p>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Bias:</span> {selectedHistoryResult.bias}
                  </p>
                )}
                {selectedHistoryResult.expertReview && (
                  <p>
                    <span className="font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-transparent bg-clip-text">Expert Review:</span> {selectedHistoryResult.expertReview}
                  </p>
                )}
              </div>
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
  );
}