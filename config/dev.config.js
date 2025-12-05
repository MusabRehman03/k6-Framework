/**
 * Development environment configuration
 */

export const devConfig = {
  // Base URL for the application under test
  baseURL: __ENV.BASE_URL || 'https://test-api.k6.io',
  
  // Reduced load for development
  scenarios: {
    dev_scenario: {
      executor: 'constant-vus',
      vus: 5,
      duration: '1m',
    },
  },
  
  // More lenient thresholds for development
  thresholds: {
    http_req_failed: ['rate<0.05'], // 5% error rate
    http_req_duration: ['p(95)<1000'], // 1 second
  },
  
  tags: {
    environment: 'dev',
  },
  
  // Browser settings
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
};
