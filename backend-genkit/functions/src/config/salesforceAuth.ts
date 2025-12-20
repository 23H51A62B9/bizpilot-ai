// src/config/salesforceAuth.ts
import axios from 'axios';

interface SalesforceAuthResponse {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

export interface SalesforceConnection {
  accessToken: string;
  instanceUrl: string;
  userId: string;
}

/**
 * Get Salesforce access token using OAuth 2.0 Password Flow
 */
export const getSalesforceConnection = async (): Promise<SalesforceConnection> => {
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;
  const securityToken = process.env.SF_SECURITY_TOKEN;
  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;

  if (!username || !password || !securityToken || !clientId || !clientSecret) {
    throw new Error('Missing required Salesforce credentials in environment variables');
  }

  try {
    const response = await axios.post<SalesforceAuthResponse>(
      'https://login.salesforce.com/services/oauth2/token',
      null,
      {
        params: {
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password + securityToken
        }
      }
    );

    const { access_token, instance_url, id } = response.data;

    console.log('Successfully authenticated with Salesforce');

    return {
      accessToken: access_token,
      instanceUrl: instance_url,
      userId: id
    };

  } catch (error: any) {
    console.error('Salesforce OAuth authentication failed:', error.message);
    throw new Error(`Salesforce authentication failed: ${error.message}`);
  }
};

/**
 * Make authenticated Salesforce API request
 */
export async function salesforceRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  data?: any
): Promise<any> {
  const conn = await getSalesforceConnection();
  
  const url = `${conn.instanceUrl}${endpoint}`;
  
  try {
    const response = await axios({
      method,
      url,
      headers: {
        'Authorization': `Bearer ${conn.accessToken}`,
        'Content-Type': 'application/json'
      },
      data
    });

    return response.data;
  } catch (error: any) {
    console.error('Salesforce API request failed:', error.message);
    throw error;
  }
}

/**
 * Execute SOQL query
 */
export async function salesforceQuery(soql: string): Promise<any> {
  const encodedQuery = encodeURIComponent(soql);
  return await salesforceRequest(`/services/data/v60.0/query?q=${encodedQuery}`);
}

/**
 * Create Salesforce record
 */
export async function salesforceCreate(objectType: string, data: any): Promise<any> {
  return await salesforceRequest(
    `/services/data/v60.0/sobjects/${objectType}`,
    'POST',
    data
  );
}

/**
 * Update Salesforce record
 */
export async function salesforceUpdate(objectType: string, recordId: string, data: any): Promise<any> {
  return await salesforceRequest(
    `/services/data/v60.0/sobjects/${objectType}/${recordId}`,
    'PATCH',
    data
  );
}