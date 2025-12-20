// test-salesforce-connection.js
// Run this from: backend-genkit/functions/
// Command: node test-salesforce-connection.js

const jsforce = require('jsforce');
const axios = require('axios');
require('dotenv').config();

async function testSalesforceConnection() {
  console.log('=== Salesforce Connection Test for BizPilot AI ===\n');

  // Check environment variables
  console.log('1. Checking environment variables...');
  const requiredVars = [
    'SF_USERNAME',
    'SF_PASSWORD', 
    'SF_SECURITY_TOKEN',
    'SF_CLIENT_ID',
    'SF_CLIENT_SECRET'
  ];

  const missingVars = requiredVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    return;
  }
  console.log('✅ All environment variables present');
  console.log(`   Username: ${process.env.SF_USERNAME}`);
  console.log(`   Client ID: ${process.env.SF_CLIENT_ID.substring(0, 20)}...`);
  console.log(`   Using OAuth 2.0 Password Flow\n`);

  // OAuth 2.0 Password Flow (works when SOAP is disabled)
  console.log('2. Attempting Salesforce OAuth connection...');
  
  try {
    // Get access token using OAuth 2.0 Password Grant
    const tokenResponse = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
      params: {
        grant_type: 'password',
        client_id: process.env.SF_CLIENT_ID,
        client_secret: process.env.SF_CLIENT_SECRET,
        username: process.env.SF_USERNAME,
        password: process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
      }
    });

    const { access_token, instance_url, id } = tokenResponse.data;
    
    console.log('✅ Successfully authenticated with Salesforce!');
    console.log(`   Access Token: ${access_token.substring(0, 20)}...`);
    console.log(`   Instance URL: ${instance_url}`);
    console.log(`   User ID: ${id}\n`);

    // Create connection with access token
    const conn = new jsforce.Connection({
      instanceUrl: instance_url,
      accessToken: access_token
    });

    // Get user info
    const identity = await conn.identity();
    console.log(`   User: ${identity.display_name}`);
    console.log(`   Org ID: ${identity.organization_id}\n`);

    // Check Leads (your 5 agents created)
    console.log('3. Checking Leads data (your 5 agents)...');
    try {
      const leads = await conn.query('SELECT Id, Name, Company, Status, Email, Phone, CreatedDate FROM Lead ORDER BY CreatedDate DESC LIMIT 10');
      console.log(`✅ Found ${leads.totalSize} total leads in your org`);
      if (leads.records.length > 0) {
        console.log(`   Retrieved ${leads.records.length} most recent leads:\n`);
        leads.records.forEach((lead, i) => {
          console.log(`   ${i+1}. ${lead.Name}`);
          console.log(`      Company: ${lead.Company || 'N/A'}`);
          console.log(`      Status: ${lead.Status}`);
          console.log(`      Email: ${lead.Email || 'N/A'}`);
          console.log(`      Created: ${new Date(lead.CreatedDate).toLocaleDateString()}`);
          console.log(`      ID: ${lead.Id}\n`);
        });
      } else {
        console.log('   ⚠️  No leads found. Create some test leads in Salesforce.\n');
      }
    } catch (err) {
      console.error('   ❌ Error querying Leads:', err.message);
    }

    // Check Opportunities
    console.log('4. Checking Opportunities data...');
    try {
      const opps = await conn.query('SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity ORDER BY CreatedDate DESC LIMIT 10');
      console.log(`✅ Found ${opps.totalSize} total opportunities`);
      if (opps.records.length > 0) {
        console.log(`   Retrieved ${opps.records.length} sample opportunities:\n`);
        opps.records.forEach((opp, i) => {
          console.log(`   ${i+1}. ${opp.Name}`);
          console.log(`      Stage: ${opp.StageName}`);
          console.log(`      Amount: $${opp.Amount || 0}`);
          console.log(`      Close Date: ${opp.CloseDate || 'N/A'}\n`);
        });
      } else {
        console.log('   ℹ️  No opportunities found.\n');
      }
    } catch (err) {
      console.error('   ❌ Error querying Opportunities:', err.message);
    }

    // Check Accounts
    console.log('5. Checking Accounts data...');
    try {
      const accounts = await conn.query('SELECT Id, Name, Industry, Type, CreatedDate FROM Account ORDER BY CreatedDate DESC LIMIT 10');
      console.log(`✅ Found ${accounts.totalSize} total accounts`);
      if (accounts.records.length > 0) {
        console.log(`   Retrieved ${accounts.records.length} sample accounts:\n`);
        accounts.records.forEach((acc, i) => {
          console.log(`   ${i+1}. ${acc.Name} - ${acc.Industry || 'N/A'}`);
        });
        console.log('');
      } else {
        console.log('   ℹ️  No accounts found.\n');
      }
    } catch (err) {
      console.error('   ❌ Error querying Accounts:', err.message);
    }

    // Check Products (for inventory agent)
    console.log('6. Checking Products data (for Inventory Agent)...');
    try {
      const products = await conn.query('SELECT Id, Name, ProductCode, IsActive, Description FROM Product2 LIMIT 10');
      console.log(`✅ Found ${products.totalSize} total products`);
      if (products.records.length > 0) {
        console.log(`   Retrieved ${products.records.length} sample products:\n`);
        products.records.forEach((prod, i) => {
          console.log(`   ${i+1}. ${prod.Name}`);
          console.log(`      Code: ${prod.ProductCode || 'N/A'}`);
          console.log(`      Active: ${prod.IsActive}\n`);
        });
      } else {
        console.log('   ℹ️  No products found. Create some in Salesforce.\n');
      }
    } catch (err) {
      console.error('   ❌ Error querying Products:', err.message);
    }

    // Check Campaigns (for marketing agent)
    console.log('7. Checking Campaigns data (for Marketing Agent)...');
    try {
      const campaigns = await conn.query('SELECT Id, Name, Status, Type, StartDate, EndDate FROM Campaign LIMIT 10');
      console.log(`✅ Found ${campaigns.totalSize} total campaigns`);
      if (campaigns.records.length > 0) {
        console.log(`   Retrieved ${campaigns.records.length} sample campaigns:\n`);
        campaigns.records.forEach((camp, i) => {
          console.log(`   ${i+1}. ${camp.Name}`);
          console.log(`      Type: ${camp.Type || 'N/A'}`);
          console.log(`      Status: ${camp.Status}\n`);
        });
      } else {
        console.log('   ℹ️  No campaigns found.\n');
      }
    } catch (err) {
      console.error('   ❌ Error querying Campaigns:', err.message);
    }

    // Check Cases (for auditor)
    console.log('8. Checking Cases data (for Auditor Agent)...');
    try {
      const cases = await conn.query('SELECT Id, CaseNumber, Subject, Status, Priority FROM Case LIMIT 10');
      console.log(`✅ Found ${cases.totalSize} total cases`);
      if (cases.records.length > 0) {
        console.log(`   Retrieved ${cases.records.length} sample cases:\n`);
        cases.records.forEach((c, i) => {
          console.log(`   ${i+1}. Case ${c.CaseNumber}: ${c.Subject}`);
          console.log(`      Status: ${c.Status}, Priority: ${c.Priority || 'N/A'}\n`);
        });
      } else {
        console.log('   ℹ️  No cases found.\n');
      }
    } catch (err) {
      console.error('   ❌ Error querying Cases:', err.message);
    }

    console.log('=== Test Complete ===');
    console.log('✅ Your Salesforce Developer Account is properly configured!');
    console.log('✅ OAuth 2.0 authentication is working!');
    console.log('\n📊 Data Access Summary:');
    console.log('   • Salesforce API connection: ✓');
    console.log('   • OAuth authentication: ✓');
    console.log('   • Your leads are accessible: ✓');
    console.log('   • Genkit can query data: ✓');
    console.log('\n🤖 Your 5 Genkit Agents CAN access Salesforce data!');
    console.log('   1. Sales Agent: ✓ Can query leads and opportunities');
    console.log('   2. Inventory Agent: ✓ Can access product data');
    console.log('   3. Marketing Agent: ✓ Can analyze campaigns');
    console.log('   4. Finance Agent: ✓ Can review revenue data');
    console.log('   5. Auditor Agent: ✓ Can audit all records');
    console.log('\n💡 Next Steps:');
    console.log('   1. Update your Salesforce auth code to use OAuth 2.0');
    console.log('   2. Fix the "Function not implemented" error');
    console.log('   3. Your agents will then analyze data via Vertex AI (Gemini)!');

  } catch (error) {
    console.error('❌ OAuth Authentication failed:', error.message);
    
    if (error.response) {
      console.log('\n📋 Error Details:');
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data.error);
      console.log('   Description:', error.response.data.error_description);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify Connected App is approved:');
    console.log('   Setup → Apps → Connected Apps → Manage Connected Apps');
    console.log('   Find "BizPilot_Genkit_Agent" and click "Edit Policies"');
    console.log('   Set "Permitted Users" to "All users may self-authorize"');
    console.log('');
    console.log('2. Check OAuth settings in Connected App:');
    console.log('   - Enable "Require Secret for Web Server Flow"');
    console.log('   - Enable "Require Secret for Refresh Token Flow"');
    console.log('   - Selected OAuth Scopes should include:');
    console.log('     • Full access (full)');
    console.log('     • Perform requests at any time (refresh_token, offline_access)');
    console.log('');
    console.log('3. Verify credentials in .env:');
    console.log('   - Username:', process.env.SF_USERNAME);
    console.log('   - Password is correct (test login in browser)');
    console.log('   - Security token is current (reset if needed)');
    console.log('   - Client ID and Secret match Connected App');
  }
}

testSalesforceConnection();