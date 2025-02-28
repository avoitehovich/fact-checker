"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface FactCheckFormProps {
  onFactCheck: (input: string, inputType: string, imageFile: File | null) => void;
}

export default function FactCheckForm({ onFactCheck }: FactCheckFormProps) {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("text");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");

  const handleSubmit = () => {
    onFactCheck(input, inputType, imageFile);
    setInput("");
    setImageFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full">
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
        onClick={handleSubmit}
        className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition flex items-center justify-center"
      >
        <FaSearch className="mr-2" /> Check Now
      </button>
    </div>
  );
}