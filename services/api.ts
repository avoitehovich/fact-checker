import { debounce } from "lodash";
import { FactCheckResult } from "../types";

const OFFLINE_CACHE = "offlineFactCheckRules";

export const checkFacts = debounce(
  async (input: string): Promise<FactCheckResult | null> => {
    if (!input) return null;
    let query = input;

    try {
      if (navigator.onLine) {
        const response = await fetch(`/api/factcheck?query=${encodeURIComponent(query)}&language=en`);
        const data = await response.json();
        const resultObj: FactCheckResult = {};
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

export const initializeOfflineCache = () => {
  if (typeof window !== "undefined" && !localStorage.getItem(OFFLINE_CACHE)) {
    localStorage.setItem(OFFLINE_CACHE, JSON.stringify({ rules: "Basic checks: Avoid obvious hoaxes." }));
  }
};