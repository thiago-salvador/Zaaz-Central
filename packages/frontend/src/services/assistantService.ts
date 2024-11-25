import { 
  Message, 
  MessageType, 
  AssistantAction, 
  AssistantPreferences,
  AssistantState 
} from '../types/assistant';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AssistantService {
  private state: AssistantState = {
    messages: [],
    isProcessing: false,
    error: null,
    preferences: {
      notificationFrequency: 'medium',
      insightTypes: ['tasks', 'meetings', 'deadlines'],
      voiceEnabled: true,
      darkMode: true,
      language: 'en',
    },
    context: {
      recentMeetings: [],
      pendingTasks: 0,
      lastInteraction: new Date().toISOString(),
    },
  };

  private generateId = () => 'msg_' + Math.random().toString(36).substr(2, 9);

  async processMessage(content: string): Promise<Message> {
    this.state.isProcessing = true;
    await delay(1000); // Simulating API call

    const response = await this.generateResponse(content);
    this.state.messages.push(response);
    this.state.isProcessing = false;
    
    return response;
  }

  private async generateResponse(query: string): Promise<Message> {
    const lowercaseQuery = query.toLowerCase();
    let type: MessageType = 'text';
    let content = '';
    let metadata = {};

    if (lowercaseQuery.includes('meeting') && lowercaseQuery.includes('summarize')) {
      type = 'summary';
      content = 'Here\'s a summary of your recent meeting:\n\n' +
        '• Discussion focused on Q4 product strategy\n' +
        '• Team agreed to prioritize mobile app development\n' +
        '• New feature rollout scheduled for December 15th';
      metadata = {
        confidence: 0.92,
        actionItems: [
          {
            id: 'task_1',
            type: 'task',
            title: 'Create mobile app roadmap',
            description: 'Develop detailed timeline for Q1 mobile app development',
            dueDate: '2023-12-01',
            assignee: 'Sarah Johnson',
            status: 'pending',
            priority: 'high',
          }
        ]
      };
    } else if (lowercaseQuery.includes('task') || lowercaseQuery.includes('todo')) {
      type = 'task';
      content = 'Here are your pending tasks:\n\n' +
        '1. Review Q4 strategy document (Due: Tomorrow)\n' +
        '2. Schedule team sync for mobile app kickoff\n' +
        '3. Update project timeline in Zaaz Central';
      metadata = {
        insights: [
          'You have 3 high-priority tasks due this week',
          'Consider delegating the project timeline update'
        ]
      };
    } else if (lowercaseQuery.includes('report') || lowercaseQuery.includes('status')) {
      type = 'report';
      content = 'Project Status Report:\n\n' +
        '• 80% of Q4 objectives are on track\n' +
        '• Mobile app development is ahead of schedule\n' +
        '• 2 tasks require immediate attention';
      metadata = {
        reportData: {
          completionRate: 0.8,
          riskyProjects: 1,
          upcomingDeadlines: 3
        }
      };
    } else {
      content = 'I\'m here to help! You can ask me to:\n' +
        '• Summarize meetings\n' +
        '• Show your tasks\n' +
        '• Generate reports\n' +
        '• Set reminders';
    }

    return {
      id: this.generateId(),
      role: 'assistant',
      type,
      content,
      timestamp: new Date().toISOString(),
      metadata,
    };
  }

  async updatePreferences(preferences: Partial<AssistantPreferences>): Promise<void> {
    this.state.preferences = {
      ...this.state.preferences,
      ...preferences,
    };
  }

  async getInsights(): Promise<Message> {
    await delay(500);
    return {
      id: this.generateId(),
      role: 'assistant',
      type: 'insight',
      content: 'Based on your recent activity:\n\n' +
        '• You have 3 unreviewed meeting summaries\n' +
        '• Team productivity has increased by 15%\n' +
        '• Consider scheduling a follow-up for yesterday\'s strategy meeting',
      timestamp: new Date().toISOString(),
      metadata: {
        insights: [
          'Meeting follow-ups pending',
          'Positive productivity trend',
          'Action items require attention'
        ]
      }
    };
  }

  getState(): AssistantState {
    return this.state;
  }
}

export const assistantService = new AssistantService();
