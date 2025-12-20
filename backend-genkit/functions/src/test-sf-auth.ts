// Test script to verify Salesforce authentication
import * as dotenv from 'dotenv';
import * as jsforce from 'jsforce';

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

        const userInfo = await conn.login(
            process.env.SF_USERNAME!,
            process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!
        );

        console.log('✅ Authentication Successful!');
        console.log('User ID:', userInfo.id);
        console.log('Org ID:', userInfo.organizationId);
        console.log('Instance URL:', conn.instanceUrl);

        // Test a simple query
        const result = await conn.query('SELECT Id, Name FROM Account LIMIT 5');
        console.log(`\n📊 Found ${result.totalSize} accounts`);
        if (result.records.length > 0) {
            console.log('Sample accounts:');
            result.records.forEach((record: any) => {
                console.log(`  - ${record.Name} (${record.Id})`);
            });
        }

        return true;
    } catch (error: any) {
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
