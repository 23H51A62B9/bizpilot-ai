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
exports.updateSalesforceTool = exports.createSalesforceTool = exports.searchSalesforceTool = void 0;
// ============================================================
// FILE 2: src/tools/salesforceTools.ts
// ============================================================
const genkit_1 = require("../genkit");
const z = __importStar(require("zod"));
const salesforceAuth_1 = require("../config/salesforceAuth");
// 1. SEARCH TOOL
exports.searchSalesforceTool = genkit_1.ai.defineTool({
    name: 'searchSalesforce',
    description: 'Executes a SOQL query to find records.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.object({ records: z.array(z.any()) })
}, async ({ query }) => {
    const result = await (0, salesforceAuth_1.salesforceQuery)(query);
    return { records: result.records };
});
// 2. CREATE TOOL
exports.createSalesforceTool = genkit_1.ai.defineTool({
    name: 'createSalesforce',
    description: 'Creates a new record in Salesforce.',
    inputSchema: z.object({
        objectType: z.string(),
        fields: z.record(z.any())
    }),
    outputSchema: z.object({ success: z.boolean(), id: z.string() })
}, async ({ objectType, fields }) => {
    const result = await (0, salesforceAuth_1.salesforceCreate)(objectType, fields);
    return { success: result.success || true, id: result.id };
});
// 3. UPDATE TOOL
exports.updateSalesforceTool = genkit_1.ai.defineTool({
    name: 'updateSalesforce',
    description: 'Updates an existing record.',
    inputSchema: z.object({
        objectType: z.string(),
        id: z.string(),
        fields: z.record(z.any())
    }),
    outputSchema: z.object({ success: z.boolean() })
}, async ({ objectType, id, fields }) => {
    await (0, salesforceAuth_1.salesforceUpdate)(objectType, id, fields);
    return { success: true };
});
//# sourceMappingURL=salesforceTools.js.map