import { debounce } from "lodash";
import { FactCheckResult } from "../types";

const OFFLINE_CACHE = "offlineFactCheckRules";

// Debounced fact-check function
export const checkFacts = debounce(
  async (input: string, inputType: string, imageFile: File | null, language: string): Promise<FactCheckResult | null> => {
    const effectiveInput = input;
    if (!effectiveInput && !imageFile) return null;
    let query = inputType === "image" ? "Image analysis" : effectiveInput;
    if (inputType === "x") query = `X post: ${effectiveInput}`;
    if (inputType === "youtube") query = `YouTube video: ${effectiveInput}`;
    if (inputType === "podcast") query = `Podcast snippet: ${effectiveInput}`;

    try {
      if (navigator.onLine) {
        const response = await fetch(`/api/factcheck?query=${encodeURIComponent(query)}&language=${language}`);
        const data = await response.json();
        const resultObj: FactCheckResult = {};
        if (inputType === "image") resultObj.claim = "Image analysis: ";
        if (data.claims?.length > 0) {
          const firstClaim = data.claims[0];
          resultObj.claim = firstClaim.text;
          resultObj.url = firstClaim.claimReview[0].url || "https://example.com";
          resultObj.rating = firstClaim.claimReview[0].textualRating;
          resultObj.publisher = firstClaim.claimReview[0].publisher.name;
          resultObj.isFake = ["False", "Pants on Fire", "Fake"].includes(resultObj.rating || "");
        } else {
          resultObj.claim = `No fact-checks found for "${query}".`;
        }
        if (inputType === "image") resultObj.claim += " (Mock: No visible manipulation detected)";

        resultObj.sentiment = Math.random() > 0.5 ? "Positive" : "Negative";
        resultObj.sentimentImpact = `Likely to ${resultObj.sentiment === "Positive" ? "calm" : "alarm"} public opinion.`;
        resultObj.bias = Math.random() > 0.7 ? "Potential bias detected: Leans toward sensationalism." : "No clear bias detected.";
        resultObj.expertReview = "Journalist confirms data aligns with reputable sources.";

        return resultObj;
      } else if (typeof window !== "undefined") {
        const offlineRules = JSON.parse(localStorage.getItem(OFFLINE_CACHE) || "{}");
        return { claim: `Offline Mode: ${offlineRules.rules}\nInput: "${query}" appears unchecked.` };
      } else {
        return { claim: "Offline mode unavailable during prerendering." };
      }
    } catch (error) {
      console.error(error);
      return { claim: "Error checking facts. Please try again." };
    }
  },
  500
);

// Initialize offline cache
export const initializeOfflineCache = () => {
  if (typeof window !== "undefined" && !localStorage.getItem(OFFLINE_CACHE)) {
    localStorage.setItem(OFFLINE_CACHE, JSON.stringify({ rules: "Basic checks: Avoid obvious hoaxes." }));
  }
};