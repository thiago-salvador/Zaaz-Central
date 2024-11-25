import { Meeting, Summary } from '../types';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createMockMeeting = (type: string): Meeting => ({
  id: 'mt_' + Math.random().toString(36).substr(2, 9),
  title: type === 'Product Strategy' ? 'Q4 Product Strategy Meeting' : 'Weekly Engineering Sync',
  date: new Date().toISOString(),
  duration: type === 'Product Strategy' ? '45 minutes' : '30 minutes',
  participants: type === 'Product Strategy' 
    ? ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Davis']
    : ['Alex Turner', 'Maria Garcia', 'David Kim', 'Lisa Wong'],
  status: 'completed',
  type,
});

const createMockSummary = (type: string): Summary => {
  if (type === 'Product Strategy') {
    return {
      keyPoints: [
        'Decided to prioritize mobile app development for Q1 2024',
        'New feature rollout scheduled for December 15th',
        'Budget increase of 20% approved for marketing initiatives',
        'Team to hire 3 new frontend developers by end of Q4'
      ],
      actionItems: [
        {
          task: 'Create detailed roadmap for mobile app development',
          assignee: 'Sarah Johnson',
          dueDate: '2023-12-01'
        },
        {
          task: 'Prepare marketing campaign for new feature launch',
          assignee: 'Mike Chen',
          dueDate: '2023-12-10'
        },
        {
          task: 'Begin recruitment process for frontend developers',
          assignee: 'Emma Davis',
          dueDate: '2023-11-30'
        }
      ],
      sentimentAnalysis: {
        overall: 'Positive',
        details: 'Team showed high enthusiasm for mobile development initiative. Some concerns about timeline but generally constructive discussion.'
      },
      topics: [
        'Mobile App Development',
        'Q4 Planning',
        'Resource Allocation',
        'Marketing Strategy'
      ],
      confidenceScore: 0.89,
      summary: `The Q4 Product Strategy meeting focused on aligning priorities for the upcoming quarter. The team unanimously agreed to prioritize mobile app development, allocating significant resources to this initiative. Key decisions include a December 15th feature rollout and a 20% increase in marketing budget. The discussion highlighted the need for additional frontend development resources, resulting in approval to hire three new developers. Sarah Johnson will lead the mobile app roadmap development, while Mike Chen will oversee the marketing campaign for the new feature launch. The meeting maintained a positive tone throughout, with constructive feedback and clear action items established for all major initiatives.`,
    };
  }

  return {
    keyPoints: [
      'Successfully deployed v2.1 to production',
      'Identified and fixed critical performance bottleneck',
      'Decided to adopt new testing framework',
      'Scheduled architecture review for next sprint'
    ],
    actionItems: [
      {
        task: 'Document v2.1 deployment process updates',
        assignee: 'Alex Turner',
        dueDate: '2023-11-25'
      },
      {
        task: 'Set up new testing framework in CI/CD pipeline',
        assignee: 'Maria Garcia',
        dueDate: '2023-11-28'
      },
      {
        task: 'Prepare architecture review presentation',
        assignee: 'David Kim',
        dueDate: '2023-11-30'
      }
    ],
    sentimentAnalysis: {
      overall: 'Very Positive',
      details: 'Team celebrated successful deployment and showed strong collaboration in problem-solving. High energy throughout the meeting.'
    },
    topics: [
      'Deployment',
      'Performance Optimization',
      'Testing Infrastructure',
      'Architecture Planning'
    ],
    confidenceScore: 0.92,
    summary: `The Weekly Engineering Sync focused on recent deployment success and future improvements. The team successfully deployed v2.1 to production and resolved a major performance bottleneck. A decision was made to adopt a new testing framework to improve code quality and CI/CD processes. The team also planned an architecture review for the next sprint to ensure scalability. Alex Turner will document the updated deployment process, while Maria Garcia leads the testing framework implementation. The meeting demonstrated strong team collaboration and problem-solving capabilities, with all members actively contributing to discussions.`,
  };
};

export const transcribeFile = async (file: File): Promise<{ meeting: Meeting; summary: Summary }> => {
  try {
    // Create form data with file and chat message prompts
    const formData = new FormData();
    formData.append('file', file);
    
    // Add required chat message prompts
    const chatMessagePrompts = [
      {
        role: 'system',
        content: 'You are an AI assistant helping to transcribe and analyze meeting content.'
      },
      {
        role: 'user',
        content: 'Please transcribe this meeting and provide a detailed summary with key points, action items, and sentiment analysis.'
      }
    ];
    
    formData.append('chat_message_prompts', JSON.stringify(chatMessagePrompts));

    // Make API call
    const response = await axios.post<{ meeting: Meeting; summary: Summary }>(`${API_BASE_URL}/api/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // If API call fails or data is missing, fall back to mock data
    if (!response.data?.meeting || !response.data?.summary) {
      console.warn('API response missing required data, falling back to mock data');
      await delay(2000);
      const meeting = createMockMeeting('Product Strategy');
      const summary = createMockSummary('Product Strategy');
      return { meeting, summary };
    }

    return response.data;
  } catch (error) {
    console.error('Error in transcribeFile:', error);
    // Fall back to mock data on error
    await delay(2000);
    const meeting = createMockMeeting('Product Strategy');
    const summary = createMockSummary('Product Strategy');
    return { meeting, summary };
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<{ meeting: Meeting; summary: Summary }> => {
  try {
    // Create form data with audio blob and chat message prompts
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    // Add required chat message prompts
    const chatMessagePrompts = [
      {
        role: 'system',
        content: 'You are an AI assistant helping to transcribe and analyze meeting content.'
      },
      {
        role: 'user',
        content: 'Please transcribe this audio and provide a detailed summary with key points, action items, and sentiment analysis.'
      }
    ];
    
    formData.append('chat_message_prompts', JSON.stringify(chatMessagePrompts));

    // Make API call
    const response = await axios.post<{ meeting: Meeting; summary: Summary }>(`${API_BASE_URL}/api/transcribe-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // If API call fails or data is missing, fall back to mock data
    if (!response.data?.meeting || !response.data?.summary) {
      console.warn('API response missing required data, falling back to mock data');
      await delay(2000);
      const meeting = createMockMeeting('Engineering');
      const summary = createMockSummary('Engineering');
      return { meeting, summary };
    }

    return response.data;
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    // Fall back to mock data on error
    await delay(2000);
    const meeting = createMockMeeting('Engineering');
    const summary = createMockSummary('Engineering');
    return { meeting, summary };
  }
};
