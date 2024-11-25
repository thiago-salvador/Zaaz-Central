import { Meeting, Insights, ProcessingEstimate } from '../types/shared';
import axios from 'axios';

interface ErrorResponse {
  message?: string;
  data?: {
    message?: string;
    code?: string;
    details?: string;
  };
  status?: number;
}

// Custom error class for API-specific errors
class APIError extends Error {
  status?: number;
  code?: string;
  details?: string;

  constructor(message: string, status?: number, code?: string, details?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromError(error: unknown): APIError {
    const errorResponse = error as ErrorResponse;
    return new APIError(
      errorResponse?.data?.message || errorResponse?.message || 'Unknown error',
      errorResponse?.status,
      errorResponse?.data?.code,
      errorResponse?.data?.details
    );
  }
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.zaazcentral.com/v1',
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Meeting Insights Service
class MeetingInsightsService {
  // Fetch all meetings
  static async fetchMeetings(): Promise<Meeting[]> {
    try {
      const cachedMeetings = localStorage.getItem('cachedMeetings');
      
      if (cachedMeetings) {
        const { data, timestamp } = JSON.parse(cachedMeetings);
        const TEN_MINUTES = 10 * 60 * 1000;
        
        if (Date.now() - timestamp < TEN_MINUTES) {
          return data;
        }
      }

      const result = await apiClient.get<Meeting[]>('/meetings');
      
      // Cache the result
      localStorage.setItem('cachedMeetings', JSON.stringify({
        data: result.data,
        timestamp: Date.now()
      }));

      return result.data;
    } catch (error) {
      // If network fails, try to return cached data
      const cachedMeetings = localStorage.getItem('cachedMeetings');
      
      if (cachedMeetings) {
        const { data } = JSON.parse(cachedMeetings);
        return data;
      }

      throw error;
    }
  }

  // Upload meeting transcript
  static async uploadTranscript(file: File): Promise<Meeting> {
    const formData = new FormData();
    formData.append('transcript', file);

    try {
      const response = await apiClient.post<Meeting>('/meetings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload transcript:', error);
      
      // Provide a more detailed error message
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = errorResponse?.data?.message 
          || errorResponse?.message 
          || 'An unexpected error occurred during upload';
        
        throw new Error(errorMessage);
      }
      
      throw new Error('An unexpected error occurred during upload');
    }
  }

  // Fetch meeting details
  static async getMeetingDetails(meetingId: string): Promise<Meeting> {
    try {
      const response = await apiClient.get<Meeting>(`/meetings/${meetingId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meeting details:', error);
      throw error;
    }
  }

  // Get meeting insights
  static async getMeetingInsights(meetingId: string): Promise<Insights | undefined> {
    try {
      const response = await apiClient.get<Insights>(`/meetings/${meetingId}/insights`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meeting insights:', error);
      return undefined;
    }
  }

  // Estimate processing time
  static async estimateProcessingTime(fileSize: number): Promise<ProcessingEstimate> {
    try {
      const response = await apiClient.post<ProcessingEstimate>('/estimate-processing', { fileSize });
      return response.data;
    } catch (error) {
      console.error('Failed to estimate processing time:', error);
      return {
        estimatedTime: 30,
        complexity: 'medium'
      };
    }
  }

  // Example method with mock data for demonstration
  static generateMockMeeting(): Meeting {
    return {
      id: 'mock-meeting-001',
      title: 'Quarterly Planning Session',
      date: new Date().toISOString(),
      duration: '30:00',
      status: 'completed',
      insights: {
        summary: 'Team discussed quarterly goals and project timelines.',
        keyTopics: ['Quarterly Goals', 'Project Planning'],
        sentimentAnalysis: {
          overall: 'positive'
        },
        actionItems: [
          {
            id: 'action-1',
            description: 'Finalize Q2 budget proposal',
            assignee: 'John Doe',
            priority: 'high',
            status: 'in-progress'
          }
        ]
      }
    };
  }
}

export default MeetingInsightsService;
