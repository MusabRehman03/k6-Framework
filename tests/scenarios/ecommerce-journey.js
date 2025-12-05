/**
 * E-commerce User Journey Example
 * 
 * This test simulates a complete e-commerce user journey:
 * 1. Browse homepage
 * 2. Search for products
 * 3. View product details
 * 4. Add to cart
 * 5. View cart
 * 6. Checkout
 * 
 * Run: k6 run tests/scenarios/ecommerce-journey.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { handleSummary } from '../../utils/summary.js';
import { randomInt, randomItem, randomString } from '../../utils/helpers/common.js';
import { createTransactionMetrics } from '../../utils/helpers/metrics.js';

// Initialize transaction metrics
const transactionMetrics = createTransactionMetrics();

// Test configuration
export const options = {
  scenarios: {
    // Realistic user journey with gradual ramp-up
    user_journey: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },  // Ramp up to 10 users
        { duration: '3m', target: 20 },  // Ramp up to 20 users
        { duration: '5m', target: 20 },  // Sustain 20 users
        { duration: '1m', target: 0 },   // Ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  
  thresholds: {
    // Overall performance
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'],
    'http_req_failed': ['rate<0.01'],
    
    // Transaction-specific thresholds
    'transaction_search_duration': ['p(95)<800'],
    'transaction_checkout_duration': ['p(95)<2000'],
    'transaction_success_rate': ['rate>0.95'],
    
    // Page-specific thresholds
    'group_duration{group:::Homepage}': ['p(95)<500'],
    'group_duration{group:::Product Search}': ['p(95)<800'],
    'group_duration{group:::Product Details}': ['p(95)<600'],
    'group_duration{group:::Add to Cart}': ['p(95)<500'],
    'group_duration{group:::Checkout}': ['p(95)<2000'],
  },
  
  tags: {
    test_type: 'scenario',
    test_name: 'ecommerce-journey',
  },
};

const BASE_URL = 'https://test-api.k6.io';

// Product categories for search
const CATEGORIES = ['electronics', 'clothing', 'books', 'toys', 'sports'];

export function setup() {
  console.log('Starting e-commerce user journey test...');
  
  // Verify system is ready
  const healthCheck = http.get(`${BASE_URL}/public/crocodiles/`);
  
  if (healthCheck.status !== 200) {
    console.error('Health check failed! System might not be ready.');
  }
  
  return {
    startTime: Date.now(),
    baseURL: BASE_URL,
  };
}

export default function(data) {
  // User session state
  let cartItems = [];
  let sessionToken = null;
  
  // Step 1: Browse Homepage
  group('Homepage', function() {
    const startTime = Date.now();
    
    const homepageRes = http.get(`${data.baseURL}/public/crocodiles/`);
    
    check(homepageRes, {
      'homepage loaded': (r) => r.status === 200,
      'homepage has content': (r) => r.body.length > 0,
      'homepage response time OK': (r) => r.timings.duration < 1000,
    });
    
    // Simulate user reading the homepage
    sleep(randomInt(2, 4));
  });
  
  // Step 2: Product Search
  group('Product Search', function() {
    const startTime = Date.now();
    const searchQuery = randomItem(CATEGORIES);
    
    // Simulate search (using list endpoint as proxy)
    const searchRes = http.get(`${data.baseURL}/public/crocodiles/`);
    
    const searchSuccess = check(searchRes, {
      'search completed': (r) => r.status === 200,
      'search has results': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body) && body.length > 0;
        } catch (e) {
          return false;
        }
      },
    });
    
    // Record search transaction
    transactionMetrics.searchDuration.add(Date.now() - startTime);
    transactionMetrics.transactionSuccess.add(searchSuccess);
    
    // User reviews search results
    sleep(randomInt(1, 3));
  });
  
  // Step 3: View Product Details
  group('Product Details', function() {
    // User selects a random product
    const productId = randomInt(1, 10);
    
    const productRes = http.get(`${data.baseURL}/public/crocodiles/${productId}/`);
    
    check(productRes, {
      'product details loaded': (r) => r.status === 200,
      'product has info': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id !== undefined && body.name !== undefined;
        } catch (e) {
          return false;
        }
      },
    });
    
    // Store product for cart
    try {
      const product = JSON.parse(productRes.body);
      cartItems.push(product.id);
    } catch (e) {
      console.warn('Failed to parse product');
    }
    
    // User reads product details, reviews
    sleep(randomInt(3, 6));
  });
  
  // Step 4: Add to Cart (if not already in cart)
  if (Math.random() > 0.2) { // 80% of users add to cart
    group('Add to Cart', function() {
      // Simulate adding to cart (using a POST endpoint)
      const payload = JSON.stringify({
        name: `Product_${randomString(8)}`,
        sex: randomItem(['M', 'F']),
        date_of_birth: '2020-01-01',
      });
      
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const addToCartRes = http.post(
        `${data.baseURL}/user/register/`,
        payload,
        params
      );
      
      check(addToCartRes, {
        'add to cart attempted': (r) => r.status !== 0,
      });
      
      sleep(1);
    });
  }
  
  // Step 5: View Cart (if items in cart)
  if (cartItems.length > 0 && Math.random() > 0.3) { // 70% view cart
    group('View Cart', function() {
      const cartRes = http.get(`${data.baseURL}/public/crocodiles/`);
      
      check(cartRes, {
        'cart loaded': (r) => r.status === 200,
      });
      
      // User reviews cart
      sleep(randomInt(2, 4));
    });
  }
  
  // Step 6: Checkout (if items in cart)
  if (cartItems.length > 0 && Math.random() > 0.5) { // 50% proceed to checkout
    group('Checkout', function() {
      const startTime = Date.now();
      
      // Simulate checkout process
      const checkoutPayload = JSON.stringify({
        username: `user_${randomString(10)}`,
        first_name: randomString(8),
        last_name: randomString(10),
        email: `user_${randomString(8)}@example.com`,
        password: 'SecurePass123!',
      });
      
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const checkoutRes = http.post(
        `${data.baseURL}/user/register/`,
        checkoutPayload,
        params
      );
      
      const checkoutSuccess = check(checkoutRes, {
        'checkout completed': (r) => r.status === 201 || r.status === 200,
        'checkout response valid': (r) => r.body.length > 0,
      });
      
      // Record checkout transaction
      transactionMetrics.checkoutDuration.add(Date.now() - startTime);
      transactionMetrics.transactionSuccess.add(checkoutSuccess);
      
      if (checkoutSuccess) {
        console.log(`✅ User ${__VU} completed checkout successfully`);
      }
      
      sleep(1);
    });
  } else {
    // User abandons cart
    console.log(`⚠️ User ${__VU} abandoned cart`);
  }
  
  // Session end - think time before next iteration
  sleep(randomInt(1, 3));
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`E-commerce journey test completed in ${duration.toFixed(2)} seconds`);
  console.log('Review transaction metrics for user behavior insights');
}

// Export the handleSummary function to generate HTML reports
export { handleSummary };
