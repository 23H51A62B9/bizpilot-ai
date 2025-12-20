"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesFlow = void 0;
// ============================================================
// FILE 3: src/flows/salesFlow.ts
// ============================================================
const genkit_1 = require("../genkit");
const zod_1 = require("zod");
const salesforceTools_1 = require("../tools/salesforceTools");
exports.salesFlow = genkit_1.ai.defineFlow({
    name: 'salesFlow',
    inputSchema: zod_1.z.string(),
    outputSchema: zod_1.z.string(),
}, async (subject) => {
    // Use Vertex AI to analyze sales data
    const prompt = `Analyze sales opportunities for: ${subject}. 
        Query Salesforce for relevant leads and opportunities.`;
    const llmResponse = await genkit_1.ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: prompt,
        tools: [salesforceTools_1.searchSalesforceTool],
        config: { temperature: 0.7 }
    });
    return llmResponse.text || `Sales Flow (Vertex AI) working for: ${subject}`;
});
//# sourceMappingURL=salesFlow.js.map