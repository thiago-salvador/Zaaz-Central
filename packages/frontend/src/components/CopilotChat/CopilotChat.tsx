import React from 'react';
import { Box } from '@mui/material';

export const CopilotChat: React.FC = () => {
  // Using the direct chat endpoint for "Zaaz Brain"
  const COPILOT_URL = 'https://copilotstudio.microsoft.com/environments/Default-e9de6572-5f50-4661-ac01-850c28507721/bots/crc2e_agente_rHuMfX/directline/token?__version__=2';

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <iframe 
        src={COPILOT_URL}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'transparent',
        }}
        title="Zaaz AI Assistant"
      />
    </Box>
  );
};

export default CopilotChat;
