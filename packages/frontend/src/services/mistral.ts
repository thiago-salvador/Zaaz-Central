const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateInsights = async (chatHistory: string[]): Promise<string[]> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an AI analyst that generates insights from chat conversations. Generate 3-5 key insights or patterns from the chat history provided. Focus on identifying main themes, user interests, and potential action items. Keep each insight concise and actionable.'
      },
      {
        role: 'user',
        content: `Here are the recent chat messages, please analyze them and provide insights: ${chatHistory.join('\n')}`
      }
    ];

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data: MistralResponse = await response.json();
    const insightsText = data.choices[0]?.message?.content || '';
    
    return insightsText
      .split('\n')
      .map(line => line.trim())
      .filter((line: string) => line.length > 0);
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
};
