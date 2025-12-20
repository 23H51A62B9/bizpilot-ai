// backend-genkit/functions/src/genkit.ts
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import * as dotenv from 'dotenv';

dotenv.config();

export const ai = genkit({
  plugins: [
    vertexAI({ 
        projectId: process.env.GCLOUD_PROJECT || 'bizpilot-ai-480607', 
        location: process.env.GCLOUD_LOCATION || 'us-central1' 
    }),
  ],
});