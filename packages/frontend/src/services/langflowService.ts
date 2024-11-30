import axios from 'axios';

// TODO: Move these to environment variables
const FLOW_ID = process.env.REACT_APP_LANGFLOW_FLOW_ID || '819a9153-cb36-40ef-9066-7e4c8b69b88e';
const LANGFLOW_ID = process.env.REACT_APP_LANGFLOW_LANGFLOW_ID || 'cc085114-ed61-4033-b381-510389336b33';
const API_KEY = process.env.REACT_APP_LANGFLOW_API_KEY || 'AstraCS:BhnAYNenuUyuewrZfpLpCMPp:b270c3cf58e04980d810ca1b5e77ef4bb15c97c17207a67e9e620272dffd6399';

// Default API endpoint - should be configurable via environment
const API_BASE_URL = process.env.REACT_APP_LANGFLOW_API_URL || 'https://api.langflow.astra.datastax.com';

const USE_MOCK = true; // Toggle this to switch between mock and real API

// Mock responses for development
const mockResponses = [
  "I understand your question. Based on the data available, I can help you analyze that. Would you like me to break down the key points?",
  "That's an interesting perspective. Let me provide some insights based on the available information.",
  "I can help you with that analysis. The main factors to consider are market trends, user behavior, and performance metrics.",
  "Good question! Let me analyze the data and provide you with a comprehensive answer.",
  "Based on the available information, here are some key insights that might help address your query."
];

let mockResponseIndex = 0;

const getMockResponse = () => {
  const response = mockResponses[mockResponseIndex];
  mockResponseIndex = (mockResponseIndex + 1) % mockResponses.length;
  return response;
};

class LangflowClient {
  private baseURL: string;
  private applicationToken: string;

  constructor(baseURL: string, applicationToken: string) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post(endpoint: string, body: any, headers: Record<string, string> = {"Content-Type": "application/json"}) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;

    try {
      console.log('Making request to:', url);
      console.log('With headers:', { ...headers, Authorization: '[REDACTED]' });
      console.log('With body:', body);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseMessage = await response.json();
      console.log('API Success Response:', responseMessage);
      return responseMessage;
    } catch (error: any) {
      console.error('Request Error:', {
        message: error.message,
        url,
        headers: { ...headers, Authorization: '[REDACTED]' },
        body
      });
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to Langflow API. Please check your network connection and API endpoint configuration.');
      }
      throw error;
    }
  }

  async initiateSession(flowId: string, langflowId: string, inputValue: string, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, { 
      input_value: inputValue, 
      input_type: inputType, 
      output_type: outputType, 
      tweaks: tweaks 
    });
  }

  async runFlow(
    flowId: string, 
    langflowId: string, 
    inputValue: string, 
    inputType = 'chat', 
    outputType = 'chat', 
    tweaks = {}, 
    stream = false
  ) {
    try {
      const initResponse = await this.initiateSession(flowId, langflowId, inputValue, inputType, outputType, stream, tweaks);
      console.log('Init Response:', initResponse);
      
      if (stream && initResponse?.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url) {
        throw new Error('Streaming is not yet supported in the frontend');
      }
      
      return initResponse;
    } catch (error: any) {
      console.error('Error running flow:', error);
      throw error;
    }
  }
}

// Default tweaks for our flow
const DEFAULT_TWEAKS = {
  "File-QLqi8": {},
  "SplitText-715Ii": {},
  "OpenAIEmbeddings-Qv6M1": {},
  "ChatInput-Bqw9E": {},
  "OpenAIEmbeddings-74lck": {},
  "ParseData-L1TRv": {},
  "Prompt-3gkMR": {},
  "OpenAIModel-g3uvZ": {},
  "ChatOutput-qj6XA": {},
  "AstraDB-8c53w": {},
  "AstraDB-7z70X": {}
};

// Create a singleton instance
const langflowClient = new LangflowClient(
  API_BASE_URL,
  API_KEY
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const langflowService = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async sendMessage(message: string): Promise<string> {
    try {
      console.log('Sending message to backend:', message);
      
      const response = await axios.post(`${BACKEND_URL}/api/chat`, {
        message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Backend response:', response.data);

      if (response.data.message) {
        return response.data.message;
      }
      
      throw new Error('Invalid response format from backend');
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(`Error: ${error.message}`);
    }
  }
};
