import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

class ChatService {
  private sessions: ChatSession[] = [];
  private currentSession: ChatSession | null = null;

  constructor() {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      this.sessions = JSON.parse(savedSessions).map((session: ChatSession) => ({
        ...session,
        timestamp: new Date(session.timestamp),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    }
  }

  private saveSessions() {
    localStorage.setItem('chatSessions', JSON.stringify(this.sessions));
  }

  createNewSession() {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };
    this.sessions.unshift(newSession);
    this.currentSession = newSession;
    this.saveSessions();
    return newSession;
  }

  getCurrentSession() {
    if (!this.currentSession) {
      return this.createNewSession();
    }
    return this.currentSession;
  }

  setCurrentSession(sessionId: string) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      this.currentSession = session;
    }
    return this.currentSession;
  }

  getSessions() {
    return this.sessions;
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const response = await axiosInstance.post('/chat', { message });
      
      if (!this.currentSession) {
        this.createNewSession();
      }

      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.message || response.data,
        timestamp: new Date()
      };

      if (this.currentSession) {
        this.currentSession.messages.push(userMessage, assistantMessage);
        this.currentSession.lastMessage = message;
        this.currentSession.timestamp = new Date();
        
        // Update title if it's still "New Chat" and this is the first message
        if (this.currentSession.title === 'New Chat' && this.currentSession.messages.length === 2) {
          this.currentSession.title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
        }
        
        this.saveSessions();
      }

      return assistantMessage;
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data?.error || 'Server error');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw new Error('Failed to send message');
      }
    }
  }

  deleteSession(sessionId: string) {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    if (this.currentSession?.id === sessionId) {
      this.currentSession = this.sessions[0] || null;
    }
    this.saveSessions();
  }

  clearSessions() {
    this.sessions = [];
    this.currentSession = null;
    this.saveSessions();
  }
}

export const chatService = new ChatService();
