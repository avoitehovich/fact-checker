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