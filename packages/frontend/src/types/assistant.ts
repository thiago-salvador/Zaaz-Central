export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageType = 'text' | 'insight' | 'summary' | 'report' | 'task' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: string;
  metadata?: {
    confidence?: number;
    source?: string;
    actionItems?: AssistantAction[];
    insights?: string[];
    reportData?: any;
    executionTime?: string;
    model?: string;
  };
}

export interface AssistantAction {
  id: string;
  type: 'task' | 'reminder' | 'meeting' | 'notification';
  title: string;
  description: string;
  dueDate?: string;
  assignee?: string;
  status: 'pending' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
}

export interface AssistantPreferences {
  notificationFrequency: 'low' | 'medium' | 'high';
  insightTypes: string[];
  voiceEnabled: boolean;
  darkMode: boolean;
  language: string;
}

export interface AssistantState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  preferences: AssistantPreferences;
  context: {
    activeProject?: string;
    recentMeetings: string[];
    pendingTasks: number;
    lastInteraction: string;
  };
}
