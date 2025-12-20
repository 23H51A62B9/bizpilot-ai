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
exports.auditorFlow = void 0;
// FILE 7: src/flows/auditorFlow.ts
// ============================================================
const genkit_1 = require("../genkit");
const z = __importStar(require("zod"));
const salesforceAuth_1 = require("../config/salesforceAuth");
exports.auditorFlow = genkit_1.ai.defineFlow({
    name: 'auditorFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Query cases for auditing
    try {
        const result = await (0, salesforceAuth_1.salesforceQuery)('SELECT Id, CaseNumber, Subject, Status, Priority FROM Case LIMIT 10');
        const llmResponse = await genkit_1.ai.generate({
            model: 'vertexai/gemini-1.5-flash',
            prompt: `Audit analysis for ${subject}. Cases: ${JSON.stringify(result.records)}`,
            config: { temperature: 0.2 }
        });
        return llmResponse.text || `Auditor Flow analyzed for ${subject}`;
    }
    catch (error) {
        console.error('Auditor query failed:', error);
        return `Auditor Flow for ${subject}`;
    }
});
//# sourceMappingURL=auditorFlow.js.map