/**
 * Advanced load test with multiple scenarios
 * 
 * Demonstrates advanced k6 features:
 * - Multiple scenarios with different executors
 * - Custom metrics
 * - Groups for organizing tests
 * - Advanced checks and validations
 * 
 * Run: k6 run tests/load/advanced-load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { handleSummary } from '../../utils/summary.js';
import { randomEmail, randomString, randomInt } from '../../utils/helpers/common.js';
import { createCustomMetrics, recordResponseMetrics } from '../../utils/helpers/metrics.js';

// Initialize custom metrics
const customMetrics = createCustomMetrics();

// Test configuration with multiple scenarios
export const options = {
  scenarios: {
    // Scenario 1: Constant load for warm-up
    warmup: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      tags: { scenario: 'warmup' },
      exec: 'warmupTest',
    },
    
    // Scenario 2: Ramping load test
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 }, // Ramp up
        { duration: '3m', target: 20 }, // Sustain
        { duration: '1m', target: 50 }, // Spike
        { duration: '1m', target: 20 }, // Scale down from spike
        { duration: '2m', target: 0 },  // Ramp down
      ],
      gracefulRampDown: '30s',
      startTime: '1m', // Start after warmup
      tags: { scenario: 'load' },
      exec: 'loadTest',
    },
    
    // Scenario 3: Constant arrival rate
    constant_rate: {
      executor: 'constant-arrival-rate',
      rate: 30,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 50,
      startTime: '1m',
      tags: { scenario: 'constant_rate' },
      exec: 'apiTest',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    'http_req_duration{scenario:load}': ['p(95)<600'],
    checks: ['rate>0.95'], // 95% of checks should pass
    
    // Custom metric thresholds
    custom_response_time: ['p(95)<400'],
    custom_error_rate: ['rate<0.02'],
  },
  
  tags: {
    test_type: 'load',
    test_name: 'advanced-load-test',
  },
};

// Setup - runs once before the test
export function setup() {
  console.log('Initializing load test...');
  
  // You could perform any setup here, like:
  // - Creating test data
  // - Authenticating to get tokens
  // - Verifying the system is ready
  
  return {
    baseURL: 'https://test-api.k6.io',
    startTime: Date.now(),
  };
}

// Warmup test function
export function warmupTest(data) {
  group('Warmup - Basic Health Check', function () {
    const res = http.get(`${data.baseURL}/public/crocodiles/`);
    
    check(res, {
      'warmup status is 200': (r) => r.status === 200,
    });
    
    recordResponseMetrics(customMetrics, res);
  });
  
  sleep(1);
}

// Main load test function
export function loadTest(data) {
  group('User Journey - Browse and View', function () {
    // Step 1: List all items
    group('List Crocodiles', function () {
      const listRes = http.get(`${data.baseURL}/public/crocodiles/`);
      
      check(listRes, {
        'list status is 200': (r) => r.status === 200,
        'list has items': (r) => {
          try {
            const body = JSON.parse(r.body);
            return Array.isArray(body) && body.length > 0;
          } catch (e) {
            return false;
          }
        },
      });
      
      recordResponseMetrics(customMetrics, listRes);
      sleep(1);
    });
    
    // Step 2: View specific item
    group('View Crocodile Details', function () {
      const id = randomInt(1, 10);
      const detailRes = http.get(`${data.baseURL}/public/crocodiles/${id}/`);
      
      check(detailRes, {
        'detail status is 200': (r) => r.status === 200,
        'detail has data': (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.id !== undefined;
          } catch (e) {
            return false;
          }
        },
      });
      
      recordResponseMetrics(customMetrics, detailRes);
      sleep(randomInt(1, 3));
    });
  });
}

// API-focused test function
export function apiTest(data) {
  group('API Endpoints Test', function () {
    // Batch multiple requests
    const responses = http.batch([
      ['GET', `${data.baseURL}/public/crocodiles/1/`, null, { tags: { name: 'crocodile-1' } }],
      ['GET', `${data.baseURL}/public/crocodiles/2/`, null, { tags: { name: 'crocodile-2' } }],
      ['GET', `${data.baseURL}/public/crocodiles/3/`, null, { tags: { name: 'crocodile-3' } }],
    ]);
    
    // Check all responses
    responses.forEach((res, index) => {
      check(res, {
        [`batch request ${index + 1} succeeded`]: (r) => r.status === 200,
      });
      
      recordResponseMetrics(customMetrics, res);
    });
    
    sleep(0.5);
  });
}

// Teardown - runs once after the test
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Load test completed in ${duration.toFixed(2)} seconds`);
}

// Export the handleSummary function to generate HTML reports
export { handleSummary };
