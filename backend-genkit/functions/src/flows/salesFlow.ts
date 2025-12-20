// ============================================================
// FILE 3: src/flows/salesFlow.ts
// ============================================================
import { ai } from '../genkit';
import { z } from 'zod';
import { searchSalesforceTool } from '../tools/salesforceTools';

export const salesFlow = ai.defineFlow(
    {
        name: 'salesFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (subject) => {
        // Use Vertex AI to analyze sales data
        const prompt = `Analyze sales opportunities for: ${subject}. 
        Query Salesforce for relevant leads and opportunities.`;

        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: prompt,
            tools: [searchSalesforceTool],
            config: { temperature: 0.7 }
        });

        return llmResponse.text || `Sales Flow (Vertex AI) working for: ${subject}`;
    }
);