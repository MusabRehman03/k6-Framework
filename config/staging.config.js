/**
 * Staging environment configuration
 */

export const stagingConfig = {
  // Base URL for staging environment
  baseURL: __ENV.BASE_URL || 'https://staging-api.example.com',
  
  // Moderate load for staging
  scenarios: {
    staging_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '3m', target: 20 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  
  // Standard thresholds
  thresholds: {
    http_req_failed: ['rate<0.02'], // 2% error rate
    http_req_duration: ['p(95)<800'], // 800ms
    'http_req_duration{expected_response:true}': ['p(99)<1500'],
  },
  
  tags: {
    environment: 'staging',
  },
  
  insecureSkipTLSVerify: false,
  noConnectionReuse: false,
};
