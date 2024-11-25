export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  type: string;
}

export interface ActionItem {
  task: string;
  assignee: string;
  dueDate: string;
}

export interface SentimentAnalysis {
  overall: string;
  details: string;
}

export interface Summary {
  keyPoints: string[];
  actionItems: ActionItem[];
  sentimentAnalysis: SentimentAnalysis;
  topics: string[];
  confidenceScore: number;
  summary: string;
}
