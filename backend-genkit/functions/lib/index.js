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
exports.auditorAgent = exports.financeAgent = exports.inventoryAgent = exports.marketingAgent = exports.salesAgent = void 0;
// ============================================================
// SOLUTION 1: Using Firebase Functions v2 (Recommended)
// ============================================================
const functions = __importStar(require("firebase-functions/v2"));
const salesFlow_1 = require("./flows/salesFlow");
const marketingFlow_1 = require("./flows/marketingFlow");
const inventoryFlow_1 = require("./flows/inventoryFlow");
const financeFlow_1 = require("./flows/financeFlow");
const auditorFlow_1 = require("./flows/auditorFlow");
// Export flows as callable Firebase Functions
exports.salesAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await (0, salesFlow_1.salesFlow)(input);
});
exports.marketingAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await (0, marketingFlow_1.marketingFlow)(input);
});
exports.inventoryAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await (0, inventoryFlow_1.inventoryFlow)(input);
});
exports.financeAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await (0, financeFlow_1.financeFlow)(input);
});
exports.auditorAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await (0, auditorFlow_1.auditorFlow)(input);
});
// ============================================================
// SOLUTION 2: Using Genkit's toFlow (Alternative)
// ============================================================
/*
import { toFlow } from 'genkit';
import * as functions from 'firebase-functions/v2';
import { salesFlow } from './flows/salesFlow';
import { marketingFlow } from './flows/marketingFlow';
import { inventoryFlow } from './flows/inventoryFlow';
import { financeFlow } from './flows/financeFlow';
import { auditorFlow } from './flows/auditorFlow';

export const salesAgent = toFlow(salesFlow, {
    name: 'salesAgent',
    httpsOptions: { cors: true }
});

export const marketingAgent = toFlow(marketingFlow, {
    name: 'marketingAgent',
    httpsOptions: { cors: true }
});

export const inventoryAgent = toFlow(inventoryFlow, {
    name: 'inventoryAgent',
    httpsOptions: { cors: true }
});

export const financeAgent = toFlow(financeFlow, {
    name: 'financeAgent',
    httpsOptions: { cors: true }
});

export const auditorAgent = toFlow(auditorFlow, {
    name: 'auditorAgent',
    httpsOptions: { cors: true }
});
*/
// ============================================================
// SOLUTION 3: HTTP Endpoints (For direct API access)
// ============================================================
/*
import * as functions from 'firebase-functions/v2';
import { salesFlow } from './flows/salesFlow';
import { marketingFlow } from './flows/marketingFlow';
import { inventoryFlow } from './flows/inventoryFlow';
import { financeFlow } from './flows/financeFlow';
import { auditorFlow } from './flows/auditorFlow';

export const salesAgent = functions.https.onRequest(
    { cors: true },
    async (req, res) => {
        try {
            const result = await salesFlow(req.body.input || req.body);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export const marketingAgent = functions.https.onRequest(
    { cors: true },
    async (req, res) => {
        try {
            const result = await marketingFlow(req.body.input || req.body);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export const inventoryAgent = functions.https.onRequest(
    { cors: true },
    async (req, res) => {
        try {
            const result = await inventoryFlow(req.body.input || req.body);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export const financeAgent = functions.https.onRequest(
    { cors: true },
    async (req, res) => {
        try {
            const result = await financeFlow(req.body.input || req.body);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

export const auditorAgent = functions.https.onRequest(
    { cors: true },
    async (req, res) => {
        try {
            const result = await auditorFlow(req.body.input || req.body);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);
*/ 
//# sourceMappingURL=index.js.map