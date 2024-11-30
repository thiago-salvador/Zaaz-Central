export interface Insight {
  id: string;
  content: string;
  timestamp: string;
  category?: string;
}

export interface InsightsState {
  items: Insight[];
  loading: boolean;
  error: string | null;
}
