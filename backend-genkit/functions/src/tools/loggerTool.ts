import { ai } from '../genkit';
import * as z from 'zod';
import { createSalesforceTool } from './salesforceTools';


export const loggerTool = ai.defineTool(
    {
        name: 'loggerTool',
        description: 'Logs agent actions to Salesforce Agent_Log__c',
        inputSchema: z.object({
            agentName: z.string(),
            summary: z.string()
        }),
        outputSchema: z.void()
    },
    async ({ agentName, summary }) => {
        // We reuse the createSalesforceTool logic here
        await createSalesforceTool({
            objectType: 'Agent_Log__c',
            fields: {
                Agent_Name__c: agentName,
                Action_Summary__c: summary
            }
        });
    }
);