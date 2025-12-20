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
exports.loggerTool = void 0;
const genkit_1 = require("../genkit");
const z = __importStar(require("zod"));
const salesforceTools_1 = require("./salesforceTools");
exports.loggerTool = genkit_1.ai.defineTool({
    name: 'loggerTool',
    description: 'Logs agent actions to Salesforce Agent_Log__c',
    inputSchema: z.object({
        agentName: z.string(),
        summary: z.string()
    }),
    outputSchema: z.void()
}, async ({ agentName, summary }) => {
    // We reuse the createSalesforceTool logic here
    await (0, salesforceTools_1.createSalesforceTool)({
        objectType: 'Agent_Log__c',
        fields: {
            Agent_Name__c: agentName,
            Action_Summary__c: summary
        }
    });
});
//# sourceMappingURL=loggerTool.js.map