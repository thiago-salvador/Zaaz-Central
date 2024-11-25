export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral';
  score: number;
  keywords: string[];
}

export interface Insights {
  summary: string;
  actionItems: string[];
  sentiment: SentimentAnalysis;
  confidenceScore: number;
  generatedAt: string;
  fileType: 'audio' | 'text';
  processingTime: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  insights?: Insights;
  fileType?: 'audio' | 'text';
  processingProgress?: number;
  retryCount?: number;
  participants?: string[];
  complexity?: 'low' | 'medium' | 'high';
}
