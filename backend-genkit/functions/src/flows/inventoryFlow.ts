// ============================================================
// FILE 5: src/flows/inventoryFlow.ts
// ============================================================
import { ai } from '../genkit';
import * as z from 'zod';
import { salesforceQuery } from '../config/salesforceAuth';

export const inventoryFlow = ai.defineFlow(
    {
        name: 'inventoryFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (subject: string) => {
        // Query products from Salesforce
        try {
            const result = await salesforceQuery(
                'SELECT Id, Name, ProductCode, IsActive FROM Product2 LIMIT 10'
            );

            const llmResponse = await ai.generate({
                model: 'googleai/gemini-1.5-flash',
                prompt: `Analyze inventory for ${subject}. Products: ${JSON.stringify(result.records)}`,
                config: { temperature: 0.5 }
            });

            return llmResponse.text || `Inventory Flow analyzed for ${subject}`;
        } catch (error) {
            console.error('Inventory query failed:', error);
            return `Inventory Flow for ${subject} - Error accessing data`;
        }
    }
);