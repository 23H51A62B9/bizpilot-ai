// FILE 7: src/flows/auditorFlow.ts
// ============================================================
import { ai } from '../genkit';
import * as z from 'zod';
import { salesforceQuery } from '../config/salesforceAuth';

export const auditorFlow = ai.defineFlow(
    {
        name: 'auditorFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (subject: string) => {
        // Query cases for auditing
        try {
            const result = await salesforceQuery(
                'SELECT Id, CaseNumber, Subject, Status, Priority FROM Case LIMIT 10'
            );

            const llmResponse = await ai.generate({
                model: 'googleai/gemini-1.5-flash',
                prompt: `Audit analysis for ${subject}. Cases: ${JSON.stringify(result.records)}`,
                config: { temperature: 0.2 }
            });

            return llmResponse.text || `Auditor Flow analyzed for ${subject}`;
        } catch (error) {
            console.error('Auditor query failed:', error);
            return `Auditor Flow for ${subject}`;
        }
    }
);