"use client";

import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";

export default function EducationalResources() {
  return (
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
  );
}