import express from 'express';
import axios from 'axios';
import { BotFrameworkAdapter } from 'botbuilder';

const router = express.Router();

router.get('/token', async (req, res) => {
    try {
        // Try to get token from Power Virtual Agents
        const response = await axios.get(
            'https://defaulte9de65725f504661ac01850c28507721.21.environment.api.powerplatform.com/powervirtualagents/botsbyschema/crc2e_agente_rHuMfX/directline/token?api-version=2022-03-01-preview',
            {
                headers: {
                    'Authorization': `Bearer ${process.env.POWER_PLATFORM_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching token:', error);
        
        // Try fallback to Bot Framework
        try {
            const adapter = new BotFrameworkAdapter({
                appId: 'c33749ad-0cb7-46bd-86e5-e998160c13db',
                appPassword: process.env.BOT_PASSWORD
            });

            const credentials = await adapter.getSignInUrl(
                req,
                res,
                {
                    appId: 'c33749ad-0cb7-46bd-86e5-e998160c13db',
                    finalRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/ai-hub`
                },
                'directline'
            );
            
            res.json({ token: credentials });
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            res.status(500).json({
                error: 'Failed to fetch token',
                details: error.response?.data || error.message,
                fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
            });
        }
    }
});

export default router;
