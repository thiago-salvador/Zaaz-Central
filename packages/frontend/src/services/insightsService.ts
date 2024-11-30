import { ChatMessage } from './chatService';
import axios from 'axios';

export type InsightType = 'conversation' | 'market';

export interface ChatInsight {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: string;
  trend?: 'up' | 'down';
  change?: string;
  timestamp: Date;
  type: InsightType;
  relatedMessages?: ChatMessage[];
  source?: string;
}

class InsightsService {
  private insights: ChatInsight[] = [];
  private chatHistory: ChatMessage[] = [];

  addMessage(message: ChatMessage) {
    this.chatHistory.push(message);
    if (message.role === 'assistant') {
      this.analyzeForInsights(message);
      this.fetchMarketInsights(message.content);
    }
  }

  private async fetchMarketInsights(content: string) {
    try {
      // Extract key topics from the conversation
      const topics = this.extractTopics(content);
      
      // For each significant topic, generate a market insight
      topics.forEach(topic => {
        const marketInsight = this.generateMarketInsight(topic);
        if (marketInsight) {
          this.insights.unshift(marketInsight);
        }
      });

      // Keep only the last 15 insights (increased from 10 to accommodate both types)
      if (this.insights.length > 15) {
        this.insights = this.insights.slice(0, 15);
      }
    } catch (error) {
      console.error('Error fetching market insights:', error);
    }
  }

  private extractTopics(content: string): string[] {
    const topics = new Set<string>();
    
    // Industry/Technology keywords
    const techKeywords = [
      'AI', 'artificial intelligence', 'machine learning', 'blockchain',
      'cloud computing', 'cybersecurity', 'data analytics', 'IoT',
      'automation', 'digital transformation', 'API', 'microservices',
      'DevOps', 'containerization', 'serverless'
    ];

    // Business keywords
    const businessKeywords = [
      'market share', 'revenue', 'growth', 'competition',
      'strategy', 'innovation', 'customer experience', 'ROI',
      'efficiency', 'productivity', 'cost reduction', 'scalability'
    ];

    [...techKeywords, ...businessKeywords].forEach(keyword => {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        topics.add(keyword);
      }
    });

    return Array.from(topics);
  }

  private generateMarketInsight(topic: string): ChatInsight | null {
    // Market trends data (simulated)
    const trends = {
      'AI': {
        growth: '+35%',
        impact: 'High',
        description: 'Rapid adoption in enterprise solutions',
      },
      'machine learning': {
        growth: '+28%',
        impact: 'High',
        description: 'Growing demand for predictive analytics',
      },
      'blockchain': {
        growth: '+15%',
        impact: 'Medium',
        description: 'Increasing enterprise applications',
      },
      'cloud computing': {
        growth: '+25%',
        impact: 'High',
        description: 'Shift towards hybrid cloud solutions',
      },
      'cybersecurity': {
        growth: '+30%',
        impact: 'High',
        description: 'Rising focus on zero-trust architecture',
      },
      // Add more trends as needed
    };

    const trend = trends[topic as keyof typeof trends];
    if (!trend) return null;

    return {
      id: `market-${Date.now()}-${Math.random()}`,
      title: `${topic} Market Trend`,
      description: trend.description,
      impact: trend.impact as 'High' | 'Medium' | 'Low',
      category: 'Market Analysis',
      trend: 'up',
      change: trend.growth,
      timestamp: new Date(),
      type: 'market',
      source: 'Market Analysis'
    };
  }

  private analyzeForInsights(message: ChatMessage) {
    // Keywords for conversation insights
    const keywords = {
      'recommend': 'Recommendation',
      'suggest': 'Suggestion',
      'improve': 'Improvement',
      'optimize': 'Optimization',
      'issue': 'Issue Identified',
      'problem': 'Problem Detected',
      'increase': 'Growth Opportunity',
      'decrease': 'Efficiency Opportunity',
      'better': 'Enhancement',
      'opportunity': 'Opportunity',
      'risk': 'Risk Assessment',
      'challenge': 'Challenge Identified',
      'solution': 'Solution Proposed',
      'benefit': 'Benefit Analysis'
    };

    for (const [keyword, category] of Object.entries(keywords)) {
      if (message.content.toLowerCase().includes(keyword)) {
        const sentences = message.content.split(/[.!?]+/);
        const relevantSentence = sentences.find(s => 
          s.toLowerCase().includes(keyword)
        )?.trim();

        if (relevantSentence) {
          const insight: ChatInsight = {
            id: `conv-${Date.now()}-${Math.random()}`,
            title: `${category} Detected`,
            description: relevantSentence,
            impact: this.determineImpact(relevantSentence),
            category: category,
            trend: this.determineTrend(relevantSentence),
            change: this.extractChange(relevantSentence),
            timestamp: new Date(),
            type: 'conversation',
            relatedMessages: [
              ...this.chatHistory.slice(-2),
            ]
          };

          this.insights.unshift(insight);
        }
      }
    }
  }

  private determineImpact(text: string): 'High' | 'Medium' | 'Low' {
    const highImpactWords = ['significant', 'critical', 'important', 'major', 'substantial', 'crucial'];
    const lowImpactWords = ['minor', 'small', 'slight', 'minimal', 'marginal'];
    
    const textLower = text.toLowerCase();
    if (highImpactWords.some(word => textLower.includes(word))) {
      return 'High';
    } else if (lowImpactWords.some(word => textLower.includes(word))) {
      return 'Low';
    }
    return 'Medium';
  }

  private determineTrend(text: string): 'up' | 'down' {
    const upTrendWords = ['increase', 'grow', 'improve', 'higher', 'better', 'more', 'gain'];
    const downTrendWords = ['decrease', 'reduce', 'lower', 'less', 'fewer', 'decline'];
    
    const textLower = text.toLowerCase();
    if (upTrendWords.some(word => textLower.includes(word))) {
      return 'up';
    }
    return 'down';
  }

  private extractChange(text: string): string {
    const percentageMatch = text.match(/\d+(\.\d+)?%/);
    if (percentageMatch) {
      return percentageMatch[0];
    }
    return this.determineTrend(text) === 'up' ? '+10%' : '-10%';
  }

  getInsights(): ChatInsight[] {
    return this.insights;
  }

  clearInsights() {
    this.insights = [];
    this.chatHistory = [];
  }
}

export const insightsService = new InsightsService();
