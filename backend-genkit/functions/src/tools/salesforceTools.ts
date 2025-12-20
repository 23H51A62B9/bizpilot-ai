// ============================================================
// FILE 2: src/tools/salesforceTools.ts
// ============================================================
import { ai } from '../genkit';
import * as z from 'zod';
import { salesforceQuery, salesforceCreate, salesforceUpdate } from '../config/salesforceAuth';

// 1. SEARCH TOOL
export const searchSalesforceTool = ai.defineTool(
    {
        name: 'searchSalesforce',
        description: 'Executes a SOQL query to find records.',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.object({ records: z.array(z.any()) })
    },
    async ({ query }) => {
        const result = await salesforceQuery(query);
        return { records: result.records };
    }
);

// 2. CREATE TOOL
export const createSalesforceTool = ai.defineTool(
    {
        name: 'createSalesforce',
        description: 'Creates a new record in Salesforce.',
        inputSchema: z.object({
            objectType: z.string(),
            fields: z.record(z.any())
        }),
        outputSchema: z.object({ success: z.boolean(), id: z.string() })
    },
    async ({ objectType, fields }) => {
        const result = await salesforceCreate(objectType, fields);
        return { success: result.success || true, id: result.id };
    }
);

// 3. UPDATE TOOL
export const updateSalesforceTool = ai.defineTool(
    {
        name: 'updateSalesforce',
        description: 'Updates an existing record.',
        inputSchema: z.object({
            objectType: z.string(),
            id: z.string(),
            fields: z.record(z.any())
        }),
        outputSchema: z.object({ success: z.boolean() })
    },
    async ({ objectType, id, fields }) => {
        await salesforceUpdate(objectType, id, fields);
        return { success: true };
    }
);