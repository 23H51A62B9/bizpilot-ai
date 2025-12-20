// ============================================================
// FILE 6: src/flows/financeFlow.ts
// ============================================================
import { ai } from '../genkit';
import * as z from 'zod';
import { salesforceQuery } from '../config/salesforceAuth';

export const financeFlow = ai.defineFlow(
    {
        name: 'financeFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (subject: string) => {
        // Query opportunities for financial analysis
        try {
            const result = await salesforceQuery(
                'SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE Amount != null LIMIT 10'
            );

            const llmResponse = await ai.generate({
                model: 'googleai/gemini-1.5-flash',
                prompt: `Financial analysis for ${subject}. Opportunities: ${JSON.stringify(result.records)}`,
                config: { temperature: 0.3 }
            });

            return llmResponse.text || `Finance Flow analyzed for ${subject}`;
        } catch (error) {
            console.error('Finance query failed:', error);
            return `Finance Flow for ${subject}`;
        }
    }
);
