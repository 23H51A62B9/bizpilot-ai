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
// Test script to verify Salesforce authentication
const dotenv = __importStar(require("dotenv"));
const jsforce = __importStar(require("jsforce"));
// Load environment variables
dotenv.config({ path: '../.env' });
async function testSalesforceAuth() {
    console.log('🔐 Testing Salesforce Authentication...\n');
    const conn = new jsforce.Connection({
        loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
    });
    try {
        console.log('📍 Instance URL:', process.env.SF_INSTANCE_URL);
        console.log('👤 Username:', process.env.SF_USERNAME);
        console.log('🔑 Using password + security token\n');
        const userInfo = await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN);
        console.log('✅ Authentication Successful!');
        console.log('User ID:', userInfo.id);
        console.log('Org ID:', userInfo.organizationId);
        console.log('Instance URL:', conn.instanceUrl);
        // Test a simple query
        const result = await conn.query('SELECT Id, Name FROM Account LIMIT 5');
        console.log(`\n📊 Found ${result.totalSize} accounts`);
        if (result.records.length > 0) {
            console.log('Sample accounts:');
            result.records.forEach((record) => {
                console.log(`  - ${record.Name} (${record.Id})`);
            });
        }
        return true;
    }
    catch (error) {
        console.error('❌ Authentication Failed!');
        console.error('Error:', error.message);
        if (error.errorCode) {
            console.error('Error Code:', error.errorCode);
        }
        return false;
    }
}
testSalesforceAuth()
    .then(success => {
    process.exit(success ? 0 : 1);
})
    .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
//# sourceMappingURL=test-sf-auth.js.map