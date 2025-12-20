// ============================================================
// SOLUTION 1: Using Firebase Functions v2 (Recommended)
// ============================================================
import * as functions from 'firebase-functions/v2';
import { salesFlow } from './flows/salesFlow';
import { marketingFlow } from './flows/marketingFlow';
import { inventoryFlow } from './flows/inventoryFlow';
import { financeFlow } from './flows/financeFlow';
import { auditorFlow } from './flows/auditorFlow';

// Export flows as callable Firebase Functions
export const salesAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await salesFlow(input);
});

export const marketingAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await marketingFlow(input);
});

export const inventoryAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await inventoryFlow(input);
});

export const financeAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await financeFlow(input);
});

export const auditorAgent = functions.https.onCall(async (request) => {
    const input = request.data.input || request.data;
    return await auditorFlow(input);
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