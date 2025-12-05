/**
 * API authentication example
 * 
 * Demonstrates how to handle authentication in k6 tests
 * Run: k6 run tests/scenarios/auth-example.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { handleSummary } from '../../utils/summary.js';
import { randomEmail, randomString } from '../../utils/helpers/common.js';

export const options = {
  vus: 10,
  duration: '1m',
  
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    'group_duration{group:::User Registration}': ['p(95)<1000'],
    'group_duration{group:::User Login}': ['p(95)<800'],
  },
  
  tags: {
    test_type: 'scenario',
    test_name: 'auth-example',
  },
};

const BASE_URL = 'https://test-api.k6.io';

export function setup() {
  console.log('Setting up authentication test...');
  return {};
}

export default function () {
  let authToken;
  
  // User Registration Flow
  group('User Registration', function () {
    const registrationPayload = JSON.stringify({
      username: randomString(10),
      first_name: randomString(8),
      last_name: randomString(10),
      email: randomEmail(),
      password: 'Test123!@#',
    });
    
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const registerRes = http.post(
      `${BASE_URL}/user/register/`,
      registrationPayload,
      params
    );
    
    const registerSuccess = check(registerRes, {
      'registration status is 201': (r) => r.status === 201,
      'registration returns user data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.username !== undefined;
        } catch (e) {
          return false;
        }
      },
    });
    
    if (registerSuccess) {
      // Extract auth token if provided
      try {
        const body = JSON.parse(registerRes.body);
        authToken = body.access || body.token;
      } catch (e) {
        console.warn('Could not parse registration response');
      }
    }
    
    sleep(1);
  });
  
  // User Login Flow
  group('User Login', function () {
    const loginPayload = JSON.stringify({
      username: `user_${randomString(8)}`,
      password: 'croc',
    });
    
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const loginRes = http.post(
      `${BASE_URL}/auth/token/login/`,
      loginPayload,
      params
    );
    
    check(loginRes, {
      'login attempted': (r) => r.status !== 0,
    });
    
    sleep(1);
  });
  
  // Authenticated Request Example
  if (authToken) {
    group('Authenticated Request', function () {
      const params = {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };
      
      const profileRes = http.get(
        `${BASE_URL}/my/crocodiles/`,
        params
      );
      
      check(profileRes, {
        'authenticated request sent': (r) => r.status !== 0,
      });
      
      sleep(1);
    });
  }
  
  sleep(1);
}

export function teardown(data) {
  console.log('Authentication test completed');
}

export { handleSummary };
