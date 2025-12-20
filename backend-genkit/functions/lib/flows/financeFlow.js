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
exports.financeFlow = void 0;
// ============================================================
// FILE 6: src/flows/financeFlow.ts
// ============================================================
const genkit_1 = require("../genkit");
const z = __importStar(require("zod"));
const salesforceAuth_1 = require("../config/salesforceAuth");
exports.financeFlow = genkit_1.ai.defineFlow({
    name: 'financeFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Query opportunities for financial analysis
    try {
        const result = await (0, salesforceAuth_1.salesforceQuery)('SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE Amount != null LIMIT 10');
        const llmResponse = await genkit_1.ai.generate({
            model: 'vertexai/gemini-1.5-flash',
            prompt: `Financial analysis for ${subject}. Opportunities: ${JSON.stringify(result.records)}`,
            config: { temperature: 0.3 }
        });
        return llmResponse.text || `Finance Flow analyzed for ${subject}`;
    }
    catch (error) {
        console.error('Finance query failed:', error);
        return `Finance Flow for ${subject}`;
    }
});
//# sourceMappingURL=financeFlow.js.map