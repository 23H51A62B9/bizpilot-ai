"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketingFlow = void 0;
// ============================================================
// FILE 4: src/flows/marketingFlow.ts
// ============================================================
const genkit_1 = require("../genkit");
const salesforceAuth_1 = require("../config/salesforceAuth");
const z = __importStar(require("zod"));
exports.marketingFlow = genkit_1.ai.defineFlow({
    name: 'marketingFlow',
    inputSchema: z.object({ productName: z.string() }),
    outputSchema: z.string(),
}, async ({ productName }) => {
    // 1. Generate Content with Vertex AI
    const llmResponse = await genkit_1.ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `Write a catchy LinkedIn post for: ${productName}.`,
        config: { temperature: 0.7 }
    });
    const content = llmResponse.text;
    // 2. Save Draft to Salesforce
    try {
        await (0, salesforceAuth_1.salesforceCreate)('Campaign', {
            Name: `Marketing: ${productName}`,
            Description: content,
            Status: 'Planned',
            Type: 'Social Media'
        });
        console.log('Campaign created in Salesforce');
    }
    catch (error) {
        console.error('Failed to save to Salesforce:', error);
    }
    return `Marketing content generated: ${content}`;
});
//# sourceMappingURL=marketingFlow.js.map