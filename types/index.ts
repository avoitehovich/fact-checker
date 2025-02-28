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
    id: string;
    text: string;
    result?: FactCheckResult;
    timestamp: number;
    edited?: boolean;
  }
  
  export interface ChatSession {
    id: string;
    title: string; // First message truncated or custom
    messages: ChatMessage[];
    timestamp: number; // Last updated
  }