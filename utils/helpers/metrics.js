/**
 * Custom metrics helpers for k6 tests
 */
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';

/**
 * Create a set of common custom metrics
 * @returns {object} - Object containing custom metrics
 */
export function createCustomMetrics() {
  return {
    // Trend metrics for tracking response times
    customResponseTime: new Trend('custom_response_time'),
    customWaitingTime: new Trend('custom_waiting_time'),
    
    // Counter metrics for tracking occurrences
    customRequests: new Counter('custom_requests'),
    customErrors: new Counter('custom_errors'),
    
    // Rate metrics for tracking ratios
    customSuccessRate: new Rate('custom_success_rate'),
    customErrorRate: new Rate('custom_error_rate'),
    
    // Gauge metrics for tracking current values
    customActiveUsers: new Gauge('custom_active_users'),
  };
}

/**
 * Record response metrics
 * @param {object} metrics - Custom metrics object
 * @param {object} res - HTTP response object
 */
export function recordResponseMetrics(metrics, res) {
  metrics.customRequests.add(1);
  metrics.customResponseTime.add(res.timings.duration);
  metrics.customWaitingTime.add(res.timings.waiting);
  
  const success = res.status >= 200 && res.status < 300;
  metrics.customSuccessRate.add(success);
  metrics.customErrorRate.add(!success);
  
  if (!success) {
    metrics.customErrors.add(1);
  }
}

/**
 * Business transaction metrics
 * Use this to track end-to-end business transactions
 */
export function createTransactionMetrics() {
  return {
    loginDuration: new Trend('transaction_login_duration'),
    checkoutDuration: new Trend('transaction_checkout_duration'),
    searchDuration: new Trend('transaction_search_duration'),
    transactionSuccess: new Rate('transaction_success_rate'),
  };
}
