/**
 * Stress test to find system limits
 * 
 * Gradually increases load to find breaking points
 * Run: k6 run tests/stress/stress-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../utils/summary.js';
import { randomInt } from '../../utils/helpers/common.js';

// Stress test configuration
export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 200,
      stages: [
        { duration: '2m', target: 20 },   // Below normal load
        { duration: '2m', target: 50 },   // Normal load
        { duration: '2m', target: 100 },  // Around breaking point
        { duration: '2m', target: 150 },  // Beyond breaking point
        { duration: '2m', target: 200 },  // Well beyond breaking point
        { duration: '3m', target: 0 },    // Scale down/recovery
      ],
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.05'], // Allow higher error rate for stress testing
  },
  
  tags: {
    test_type: 'stress',
    test_name: 'stress-test',
  },
};

export function setup() {
  console.log('Starting stress test to find system limits...');
  return { baseURL: 'https://test-api.k6.io' };
}

export default function (data) {
  const res = http.get(`${data.baseURL}/public/crocodiles/${randomInt(1, 10)}/`);
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 2000,
  });
  
  if (!success) {
    console.warn(`Request failed: status=${res.status}, duration=${res.timings.duration}ms`);
  }
  
  sleep(0.5);
}

export function teardown(data) {
  console.log('Stress test completed. Review metrics to identify breaking points.');
}

export { handleSummary };
