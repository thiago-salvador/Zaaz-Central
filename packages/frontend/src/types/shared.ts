export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral';
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface Insights {
  summary: string;
  keyTopics: string[];
  sentimentAnalysis: SentimentAnalysis;
  actionItems: ActionItem[];
}

export interface ProcessingEstimate {
  estimatedTime: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  insights?: Insights;
}

export type SummaryLength = 'short' | 'medium' | 'detailed';

export interface SummaryPreferences {
  length: SummaryLength;
  highlightedPhrases?: string[];
}

export type FocusPoint = 'general' | 'action_items' | 'decisions' | 'key_points' | 'follow_ups';

export interface SummaryFeedback {
  type: 'accuracy' | 'relevance' | 'clarity';
  rating: number;
  comment?: string;
}

export interface MeetingSummary {
  id: string;
  meetingId: string;
  summaryPreferences: SummaryPreferences;
  feedback?: SummaryFeedback[];
  focusPoint?: FocusPoint;
}

// API Error Class
export class APIError extends Error {
  statusCode?: number;
  errorCode?: string;

  constructor(message: string, statusCode?: number, errorCode?: string) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }

  static fromError(error: any): APIError {
    if (error instanceof APIError) {
      return error;
    }

    return new APIError(
      error.message || 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}
