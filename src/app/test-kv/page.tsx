'use client';

import { useState, useEffect } from 'react';

export default function TestKVPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-cloudflare-api');
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cloudflare KV API Test</h1>
      
      <button
        onClick={runTest}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? 'Testing...' : 'Test Cloudflare KV API'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Test Results</h2>
          
          <div className={`p-4 ${testResult.success ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} rounded border`}>
            <p className="font-bold">Status: {testResult.success ? 'Success' : 'Failed'}</p>
            
            {testResult.environment && (
              <div className="mt-2">
                <p className="font-bold">Environment:</p>
                <ul className="list-disc ml-6">
                  <li>Account ID: {testResult.environment.accountID}</li>
                  <li>Namespace ID: {testResult.environment.namespaceID}</li>
                  <li>API Token: {testResult.environment.apiToken}</li>
                </ul>
              </div>
            )}
            
            {testResult.writeResult && (
              <div className="mt-2">
                <p className="font-bold">Write Result:</p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult.writeResult, null, 2)}
                </pre>
              </div>
            )}
            
            {testResult.readResult && (
              <div className="mt-2">
                <p className="font-bold">Read Result:</p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult.readResult, null, 2)}
                </pre>
              </div>
            )}
            
            {testResult.error && (
              <div className="mt-2">
                <p className="font-bold">Error:</p>
                <p>{testResult.error}</p>
                {testResult.details && (
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto mt-2">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Setup Instructions</h2>
        <p className="mb-4">
          To use Cloudflare KV with Vercel functions, you need to set the following environment variables in your Vercel project:
        </p>
        
        <ul className="list-disc ml-6 mb-4">
          <li><strong>CLOUDFLARE_ACCOUNT_ID</strong>: Your Cloudflare account ID (found in the dashboard URL)</li>
          <li><strong>CLOUDFLARE_KV_NAMESPACE_ID</strong>: The ID of your KV namespace</li>
          <li><strong>CLOUDFLARE_KV_API_TOKEN</strong>: API token with Workers KV Storage permissions</li>
        </ul>
        
        <p className="mb-4">
          The API token should have the following permissions:
        </p>
        
        <ul className="list-disc ml-6">
          <li>Account / Workers KV Storage / Edit</li>
          <li>Account / Workers KV Storage / Read</li>
        </ul>
      </div>
    </div>
  );
}