// Simple HTTP client to test the worker
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8787,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('TEST 1: Setting value');
    const setResult = await makeRequest('/test/set');
    console.log(JSON.stringify(setResult, null, 2));
    
    console.log('\nTEST 2: Getting value');
    const getResult = await makeRequest('/test/get');
    console.log(JSON.stringify(getResult, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();