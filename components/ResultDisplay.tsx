"use client";

import { motion } from "framer-motion";
import { FactCheckResult } from "../types";

interface ResultDisplayProps {
  result: FactCheckResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  return (
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
  );
}