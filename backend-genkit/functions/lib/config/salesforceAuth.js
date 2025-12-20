"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesforceConnection = void 0;
exports.salesforceRequest = salesforceRequest;
exports.salesforceQuery = salesforceQuery;
exports.salesforceCreate = salesforceCreate;
exports.salesforceUpdate = salesforceUpdate;
// src/config/salesforceAuth.ts
const axios_1 = __importDefault(require("axios"));
/**
 * Get Salesforce access token using OAuth 2.0 Password Flow
 */
const getSalesforceConnection = async () => {
    const username = process.env.SF_USERNAME;
    const password = process.env.SF_PASSWORD;
    const securityToken = process.env.SF_SECURITY_TOKEN;
    const clientId = process.env.SF_CLIENT_ID;
    const clientSecret = process.env.SF_CLIENT_SECRET;
    if (!username || !password || !securityToken || !clientId || !clientSecret) {
        throw new Error('Missing required Salesforce credentials in environment variables');
    }
    try {
        const response = await axios_1.default.post('https://login.salesforce.com/services/oauth2/token', null, {
            params: {
                grant_type: 'password',
                client_id: clientId,
                client_secret: clientSecret,
                username: username,
                password: password + securityToken
            }
        });
        const { access_token, instance_url, id } = response.data;
        console.log('Successfully authenticated with Salesforce');
        return {
            accessToken: access_token,
            instanceUrl: instance_url,
            userId: id
        };
    }
    catch (error) {
        console.error('Salesforce OAuth authentication failed:', error.message);
        throw new Error(`Salesforce authentication failed: ${error.message}`);
    }
};
exports.getSalesforceConnection = getSalesforceConnection;
/**
 * Make authenticated Salesforce API request
 */
async function salesforceRequest(endpoint, method = 'GET', data) {
    const conn = await (0, exports.getSalesforceConnection)();
    const url = `${conn.instanceUrl}${endpoint}`;
    try {
        const response = await (0, axios_1.default)({
            method,
            url,
            headers: {
                'Authorization': `Bearer ${conn.accessToken}`,
                'Content-Type': 'application/json'
            },
            data
        });
        return response.data;
    }
    catch (error) {
        console.error('Salesforce API request failed:', error.message);
        throw error;
    }
}
/**
 * Execute SOQL query
 */
async function salesforceQuery(soql) {
    const encodedQuery = encodeURIComponent(soql);
    return await salesforceRequest(`/services/data/v60.0/query?q=${encodedQuery}`);
}
/**
 * Create Salesforce record
 */
async function salesforceCreate(objectType, data) {
    return await salesforceRequest(`/services/data/v60.0/sobjects/${objectType}`, 'POST', data);
}
/**
 * Update Salesforce record
 */
async function salesforceUpdate(objectType, recordId, data) {
    return await salesforceRequest(`/services/data/v60.0/sobjects/${objectType}/${recordId}`, 'PATCH', data);
}
//# sourceMappingURL=salesforceAuth.js.map