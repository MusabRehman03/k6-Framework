/**
 * Base configuration for k6 tests
 */

export const baseConfig = {
  // Test execution parameters
  scenarios: {
    default: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  
  // Thresholds define the performance criteria
  thresholds: {
    // HTTP errors should be less than 1%
    http_req_failed: ['rate<0.01'],
    
    // 95% of requests should be below 500ms
    http_req_duration: ['p(95)<500'],
    
    // 99% of requests should be below 1000ms
    'http_req_duration{expected_response:true}': ['p(99)<1000'],
    
    // Request rate should be at least 10 req/s
    http_reqs: ['rate>10'],
  },
  
  // HTTP request tags
  tags: {
    test_type: 'base',
  },
  
  // Disable browser metrics collection
  noConnectionReuse: false,
  userAgent: 'K6-LoadTest/1.0',
};

/**
 * Get configuration by merging base with custom options
 * @param {object} customOptions - Custom options to merge
 * @returns {object} - Merged configuration
 */
export function getConfig(customOptions = {}) {
  return {
    ...baseConfig,
    ...customOptions,
    thresholds: {
      ...baseConfig.thresholds,
      ...(customOptions.thresholds || {}),
    },
    tags: {
      ...baseConfig.tags,
      ...(customOptions.tags || {}),
    },
  };
}
