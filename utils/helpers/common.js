/**
 * Common helper functions for k6 tests
 */

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random email address
 * @returns {string} - Random email
 */
export function randomEmail() {
  return `user_${randomString(8)}@example.com`;
}

/**
 * Generate a random item from an array
 * @param {Array} array - Array to pick from
 * @returns {*} - Random item
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Calculate a random duration between min and max seconds
 * Note: This returns the duration value - use with sleep() function
 * @param {number} min - Minimum duration in seconds
 * @param {number} max - Maximum duration in seconds
 * @returns {number} - Random duration in seconds
 */
export function randomDuration(min, max) {
  const duration = Math.random() * (max - min) + min;
  return duration;
}

/**
 * Generate random user data
 * @returns {object} - User data object
 */
export function randomUser() {
  return {
    username: randomString(10),
    email: randomEmail(),
    firstName: randomString(8),
    lastName: randomString(10),
    age: randomInt(18, 80),
  };
}

/**
 * Custom error rate check
 * @param {object} res - HTTP response object
 * @param {string} tag - Tag name for the error
 * @returns {boolean} - Whether the response was successful
 */
export function checkStatus(res, tag = 'status') {
  const success = res.status >= 200 && res.status < 300;
  if (!success) {
    console.error(`Request failed with status ${res.status}: ${res.body}`);
  }
  return success;
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Bytes to format
 * @returns {string} - Formatted string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
