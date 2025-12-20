// ============================================================
// FILE 4: src/flows/marketingFlow.ts
// ============================================================
import { ai } from '../genkit';
import { salesforceCreate } from '../config/salesforceAuth';
import * as z from 'zod';

export const marketingFlow = ai.defineFlow(
    {
        name: 'marketingFlow',
        inputSchema: z.object({ productName: z.string() }),
        outputSchema: z.string(),
    },
    async ({ productName }) => {
        // 1. Generate Content with Vertex AI
        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: `Write a catchy LinkedIn post for: ${productName}.`,
            config: { temperature: 0.7 }
        });
        const content = llmResponse.text;

        // 2. Save Draft to Salesforce
        try {
            await salesforceCreate('Campaign', {
                Name: `Marketing: ${productName}`,
                Description: content,
                Status: 'Planned',
                Type: 'Social Media'
            });
            console.log('Campaign created in Salesforce');
        } catch (error) {
            console.error('Failed to save to Salesforce:', error);
        }

        return `Marketing content generated: ${content}`;
    }
);
