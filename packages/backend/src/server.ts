import express from 'express';
import cors from 'cors';
import { Router } from 'express';
import axios from 'axios';
import copilotRoutes from './routes/copilotRoutes';

const app = express();
const router = Router();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AI Chat Backend API' });
});

// Mount router with /api prefix
app.use('/api', router);

// Copilot routes
app.use('/api/copilot', copilotRoutes);

// Routes
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);

    const LANGFLOW_API_URL = process.env.LANGFLOW_API_URL || 'https://api.langflow.astra.datastax.com/lf/cc085114-ed61-4033-b381-510389336b33/api/v1/run/819a9153-cb36-40ef-9066-7e4c8b69b88e';
    const API_KEY = process.env.LANGFLOW_API_KEY || 'AstraCS:BhnAYNenuUyuewrZfpLpCMPp:b270c3cf58e04980d810ca1b5e77ef4bb15c97c17207a67e9e620272dffd6399';

    const response = await axios.post(
      `${LANGFLOW_API_URL}?stream=false`,
      {
        input_value: message,
        output_type: 'chat',
        input_type: 'chat',
        tweaks: {
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
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    console.log('Langflow response:', response.data);
    
    // Extract and format the message text
    let messageText = '';
    const outputs = response.data?.outputs?.[0]?.outputs?.[0];
    
    if (outputs?.results?.message?.text) {
      messageText = outputs.results.message.text;
    } else if (outputs?.artifacts?.message) {
      messageText = outputs.artifacts.message;
    } else {
      messageText = 'No response from AI';
    }

    // Clean up and format the text
    messageText = messageText
      // Preserve line breaks
      .replace(/\n\n/g, '\n\n')
      // Ensure proper spacing for lists
      .replace(/\n(\d+\.|\*)/g, '\n\n$1')
      // Preserve bold formatting
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      // Preserve italic formatting
      .replace(/\*(.*?)\*/g, '*$1*')
      // Ensure headers have proper spacing
      .replace(/\n(#{1,6})/g, '\n\n$1');
    
    res.json({
      message: messageText
    });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: error.message || 'Failed to get response from Langflow'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
