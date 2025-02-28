export interface FactCheckResult {
    claim?: string;
    url?: string;
    rating?: string;
    publisher?: string;
    sentiment?: string;
    sentimentImpact?: string;
    bias?: string;
    expertReview?: string;
    isFake?: boolean;
  }
  
  export interface ChatMessage {
    id: string;                // Unique identifier
    text: string;              // User input
    result?: FactCheckResult;  // Fact-check result
    timestamp: number;         // For edit time limit
    edited?: boolean;          // Track if edited
  }