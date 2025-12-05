/**
 * Example configuration helper
 * Shows how to load and use different environment configurations
 */

import { baseConfig } from './base.config.js';
import { devConfig } from './dev.config.js';
import { stagingConfig } from './staging.config.js';
import { prodConfig } from './prod.config.js';

/**
 * Get configuration based on environment
 * @param {string} env - Environment name (dev, staging, prod)
 * @returns {object} - Configuration object
 */
export function getEnvConfig(env = 'dev') {
  const configs = {
    dev: devConfig,
    staging: stagingConfig,
    prod: prodConfig,
  };
  
  const envConfig = configs[env.toLowerCase()] || devConfig;
  
  // Merge with base config
  return {
    ...baseConfig,
    ...envConfig,
    thresholds: {
      ...baseConfig.thresholds,
      ...envConfig.thresholds,
    },
    tags: {
      ...baseConfig.tags,
      ...envConfig.tags,
    },
  };
}

/**
 * Get base URL based on environment variable or config
 * @param {string} defaultEnv - Default environment if not set
 * @returns {string} - Base URL
 */
export function getBaseURL(defaultEnv = 'dev') {
  // Check environment variable first
  if (__ENV.BASE_URL) {
    return __ENV.BASE_URL;
  }
  
  // Otherwise use config
  const env = __ENV.ENVIRONMENT || defaultEnv;
  const config = getEnvConfig(env);
  return config.baseURL;
}
