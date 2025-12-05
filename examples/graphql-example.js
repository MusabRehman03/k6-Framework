/**
 * GraphQL Testing Example
 * 
 * Demonstrates how to test GraphQL APIs with k6
 * Run: k6 run examples/graphql-example.js
 */

import http from 'k6/http';
import { check } from 'k6';
import { handleSummary } from '../utils/summary.js';

export const options = {
  vus: 5,
  duration: '30s',
  
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.01'],
  },
  
  tags: {
    test_type: 'example',
    test_name: 'graphql-example',
  },
};

const GRAPHQL_ENDPOINT = 'https://test-api.k6.io/public/crocodiles/';

export default function () {
  // GraphQL query example
  const query = `
    query GetItems {
      items {
        id
        name
        description
      }
    }
  `;
  
  // For this example, we'll use the REST endpoint
  // In a real GraphQL test, you would POST to your GraphQL endpoint
  const payload = JSON.stringify({
    query: query,
    variables: {},
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Simulating GraphQL request using GET for demo
  const res = http.get(GRAPHQL_ENDPOINT);
  
  check(res, {
    'GraphQL query successful': (r) => r.status === 200,
    'has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body !== null;
      } catch (e) {
        return false;
      }
    },
  });
}

export { handleSummary };

/**
 * Real-world GraphQL example structure:
 * 
 * const res = http.post(
 *   'https://api.example.com/graphql',
 *   payload,
 *   params
 * );
 * 
 * check(res, {
 *   'no errors': (r) => {
 *     const body = JSON.parse(r.body);
 *     return !body.errors;
 *   },
 *   'has data': (r) => {
 *     const body = JSON.parse(r.body);
 *     return body.data !== null;
 *   },
 * });
 */
