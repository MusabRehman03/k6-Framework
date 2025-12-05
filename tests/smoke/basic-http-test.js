/**
 * Basic HTTP test example
 * 
 * This is a simple smoke test that verifies basic API functionality
 * Run: k6 run tests/smoke/basic-http-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../utils/summary.js';
import { randomInt } from '../../utils/helpers/common.js';

// Test configuration
export const options = {
  vus: 5, // 5 virtual users
  duration: '30s', // Test duration
  
  thresholds: {
    // 99% of requests should complete within 2s
    http_req_duration: ['p(99)<2000'],
    // Error rate should be less than 1%
    http_req_failed: ['rate<0.01'],
  },
  
  tags: {
    test_type: 'smoke',
    test_name: 'basic-http-test',
  },
};

// Setup function - runs once before the test
export function setup() {
  console.log('Starting smoke test...');
  return { startTime: new Date().toISOString() };
}

// Main test function - runs for each VU iteration
export default function (data) {
  // Make a simple GET request
  const response = http.get('https://test-api.k6.io/public/crocodiles/');
  
  // Verify the response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has crocodiles': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) && body.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  // Get a specific crocodile
  const crocodileId = randomInt(1, 10);
  const detailResponse = http.get(`https://test-api.k6.io/public/crocodiles/${crocodileId}/`);
  
  check(detailResponse, {
    'detail status is 200': (r) => r.status === 200,
    'has crocodile details': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id !== undefined && body.name !== undefined;
      } catch (e) {
        return false;
      }
    },
  });
  
  // Think time - simulate user reading the page
  sleep(randomInt(1, 3));
}

// Teardown function - runs once after the test
export function teardown(data) {
  console.log(`Test completed. Started at: ${data.startTime}`);
}

// Export the handleSummary function to generate HTML reports
export { handleSummary };
