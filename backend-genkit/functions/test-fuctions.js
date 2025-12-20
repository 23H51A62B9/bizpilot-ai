// test-functions.js
// Save this file and run: node test-functions.js

const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5001/bizpilot-ai-480607/us-central1';

// Test configuration
const tests = [
  {
    name: 'Sales Agent',
    endpoint: `${BASE_URL}/salesAgent`,
    payload: { data: { input: 'enterprise software deals' } }
  },
  {
    name: 'Marketing Agent',
    endpoint: `${BASE_URL}/marketingAgent`,
    payload: { data: { input: { productName: 'BizPilot AI Platform' } } }
  },
  {
    name: 'Inventory Agent',
    endpoint: `${BASE_URL}/inventoryAgent`,
    payload: { data: { input: 'cloud services' } }
  },
  {
    name: 'Finance Agent',
    endpoint: `${BASE_URL}/financeAgent`,
    payload: { data: { input: 'Q4 2024 revenue' } }
  },
  {
    name: 'Auditor Agent',
    endpoint: `${BASE_URL}/auditorAgent`,
    payload: { data: { input: 'compliance check' } }
  }
];

async function testFunction(test) {
  console.log(`\n🧪 Testing ${test.name}...`);
  console.log(`📍 Endpoint: ${test.endpoint}`);
  
  try {
    const response = await axios.post(test.endpoint, test.payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`✅ SUCCESS`);
    console.log(`📊 Response:`, JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ ERROR`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Cloud Functions Tests...\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const test of tests) {
    const result = await testFunction(test);
    results.push({ ...test, ...result });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}`);
  });
}

// Run tests
runAllTests().catch(console.error);