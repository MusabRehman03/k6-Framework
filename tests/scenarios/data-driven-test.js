/**
 * Example of using external data in k6 tests
 * 
 * Run: k6 run tests/scenarios/data-driven-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../utils/summary.js';
import { SharedArray } from 'k6/data';

// Load test data (loaded once and shared across all VUs)
const users = new SharedArray('users', function () {
  return JSON.parse(open('../../data/users.json'));
});

export const options = {
  vus: 5,
  iterations: users.length * 2, // Run through all users twice
  
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
  
  tags: {
    test_type: 'scenario',
    test_name: 'data-driven-test',
  },
};

export default function () {
  // Get a user from the array (round-robin style)
  const user = users[__ITER % users.length];
  
  console.log(`Testing with user: ${user.username}`);
  
  // Use the user data in the request
  const payload = JSON.stringify({
    username: user.username,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    password: 'Test123!@#',
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const res = http.post(
    'https://test-api.k6.io/user/register/',
    payload,
    params
  );
  
  check(res, {
    'status is 201': (r) => r.status === 201,
    'username matches': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.username === user.username;
      } catch (e) {
        return false;
      }
    },
  });
  
  sleep(1);
}

export { handleSummary };
