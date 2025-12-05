/**
 * Production environment configuration
 */

export const prodConfig = {
  // Base URL for production environment
  baseURL: __ENV.BASE_URL || 'https://api.example.com',
  
  // Production-like load
  scenarios: {
    prod_scenario: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 100,
      stages: [
        { duration: '2m', target: 50 }, // Ramp up to 50 RPS
        { duration: '5m', target: 50 }, // Stay at 50 RPS
        { duration: '2m', target: 100 }, // Ramp up to 100 RPS
        { duration: '5m', target: 100 }, // Stay at 100 RPS
        { duration: '2m', target: 0 }, // Ramp down
      ],
    },
  },
  
  // Strict thresholds for production
  thresholds: {
    http_req_failed: ['rate<0.01'], // 1% error rate
    http_req_duration: ['p(95)<500'], // 500ms
    'http_req_duration{expected_response:true}': ['p(99)<1000'], // 1 second
    http_reqs: ['rate>10'], // At least 10 requests per second
  },
  
  tags: {
    environment: 'production',
  },
  
  insecureSkipTLSVerify: false,
  noConnectionReuse: false,
};
