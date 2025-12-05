# k6 Best Practices Guide

This guide covers best practices for performance testing with k6, based on official documentation and community recommendations.

## 📋 Table of Contents

1. [Test Design](#test-design)
2. [Script Organization](#script-organization)
3. [Performance Optimization](#performance-optimization)
4. [Data Management](#data-management)
5. [Metrics and Monitoring](#metrics-and-monitoring)
6. [Thresholds](#thresholds)
7. [Common Pitfalls](#common-pitfalls)

## Test Design

### Use Appropriate Test Types

**Smoke Test**: Minimal load to verify system works
```javascript
export const options = {
  vus: 1,
  duration: '1m',
};
```

**Load Test**: Normal and peak load conditions
```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 },  // Ramp up
    { duration: '10m', target: 100 }, // Stay at peak
    { duration: '5m', target: 0 },    // Ramp down
  ],
};
```

**Stress Test**: Beyond normal capacity
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 0 },
  ],
};
```

**Spike Test**: Sudden traffic increase
```javascript
export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 }, // Spike!
    { duration: '3m', target: 1400 },
    { duration: '10s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};
```

### Choose the Right Executor

**constant-vus**: Fixed number of VUs
```javascript
scenarios: {
  my_scenario: {
    executor: 'constant-vus',
    vus: 10,
    duration: '5m',
  },
}
```

**ramping-vus**: Gradually increase/decrease VUs
```javascript
scenarios: {
  my_scenario: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 50 },
      { duration: '2m', target: 0 },
    ],
  },
}
```

**constant-arrival-rate**: Fixed request rate
```javascript
scenarios: {
  my_scenario: {
    executor: 'constant-arrival-rate',
    rate: 100, // 100 iterations per timeUnit
    timeUnit: '1s',
    duration: '5m',
    preAllocatedVUs: 50,
    maxVUs: 100,
  },
}
```

**ramping-arrival-rate**: Variable request rate
```javascript
scenarios: {
  my_scenario: {
    executor: 'ramping-arrival-rate',
    startRate: 10,
    timeUnit: '1s',
    preAllocatedVUs: 50,
    maxVUs: 200,
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 100 },
      { duration: '2m', target: 0 },
    ],
  },
}
```

## Script Organization

### Modular Structure

**Bad**:
```javascript
// Everything in one file
export default function() {
  // 500 lines of code...
}
```

**Good**:
```javascript
// Import helpers
import { login, browse, checkout } from './helpers/user-flows.js';
import { createMetrics } from './helpers/metrics.js';

export default function() {
  login();
  browse();
  checkout();
}
```

### Use Groups for Organization

```javascript
import { group } from 'k6';

export default function() {
  group('User Login', function() {
    // Login logic
  });
  
  group('Browse Products', function() {
    // Browse logic
  });
  
  group('Checkout', function() {
    // Checkout logic
  });
}
```

## Performance Optimization

### Minimize Memory Usage

**Use SharedArray for Data**:
```javascript
import { SharedArray } from 'k6/data';

// Bad: Each VU gets a copy
const users = JSON.parse(open('./users.json'));

// Good: Shared across all VUs
const users = new SharedArray('users', function() {
  return JSON.parse(open('./users.json'));
});
```

### Optimize HTTP Requests

**Batch Requests**:
```javascript
import http from 'k6/http';

// Bad: Sequential requests
const res1 = http.get('https://api.example.com/users/1');
const res2 = http.get('https://api.example.com/users/2');
const res3 = http.get('https://api.example.com/users/3');

// Good: Parallel requests
const responses = http.batch([
  ['GET', 'https://api.example.com/users/1'],
  ['GET', 'https://api.example.com/users/2'],
  ['GET', 'https://api.example.com/users/3'],
]);
```

**Reuse Connections**:
```javascript
export const options = {
  noConnectionReuse: false, // Default, but explicit
};
```

### Control Think Time

```javascript
import { sleep } from 'k6';

export default function() {
  // Make request
  http.get('https://api.example.com');
  
  // Realistic think time (1-3 seconds)
  sleep(Math.random() * 2 + 1);
}
```

## Data Management

### Load Data Efficiently

```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// CSV data
const csvData = new SharedArray('csvData', function() {
  return papaparse.parse(open('./data.csv'), { header: true }).data;
});

// JSON data
const jsonData = new SharedArray('jsonData', function() {
  return JSON.parse(open('./data.json'));
});
```

### Parameterize Tests

```javascript
// Use environment variables
const baseURL = __ENV.BASE_URL || 'https://default.com';
const apiKey = __ENV.API_KEY;

export default function() {
  const params = {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  };
  
  http.get(`${baseURL}/api/endpoint`, params);
}
```

## Metrics and Monitoring

### Use Built-in Metrics

```javascript
import { check } from 'k6';

export default function() {
  const res = http.get('https://api.example.com');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'body contains data': (r) => r.body.includes('data'),
  });
}
```

### Create Custom Metrics

```javascript
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';

const loginDuration = new Trend('login_duration');
const loginAttempts = new Counter('login_attempts');
const loginSuccess = new Rate('login_success');
const activeUsers = new Gauge('active_users');

export default function() {
  const start = Date.now();
  const res = login();
  loginDuration.add(Date.now() - start);
  
  loginAttempts.add(1);
  loginSuccess.add(res.status === 200);
  activeUsers.add(__VU);
}
```

## Thresholds

### Set Realistic Thresholds

```javascript
export const options = {
  thresholds: {
    // Response time
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    
    // Error rate
    'http_req_failed': ['rate<0.01'],
    
    // Throughput
    'http_reqs': ['rate>100'],
    
    // Checks
    'checks': ['rate>0.95'],
    
    // Group-specific
    'group_duration{group:::Login}': ['p(95)<1000'],
    
    // Custom metrics
    'login_duration': ['p(95)<800'],
    'login_success': ['rate>0.99'],
  },
};
```

### Abort on Failure

```javascript
export const options = {
  thresholds: {
    'http_req_failed': [
      { threshold: 'rate<0.01', abortOnFail: true }
    ],
  },
};
```

## Common Pitfalls

### ❌ Don't: Use JavaScript Libraries That Aren't Compatible

k6 uses a custom JavaScript runtime. Not all Node.js libraries work.

```javascript
// This won't work
import fs from 'fs';
```

### ✅ Do: Use k6-Compatible Libraries

```javascript
// Use k6's open() function
const data = open('./data.json');

// Or use k6-compatible jslib
import http from 'k6/http';
```

### ❌ Don't: Make Assertions in Default Function

```javascript
// Don't throw errors in the default function
export default function() {
  const res = http.get('https://api.example.com');
  if (res.status !== 200) {
    throw new Error('Failed!'); // This stops the VU
  }
}
```

### ✅ Do: Use Checks Instead

```javascript
export default function() {
  const res = http.get('https://api.example.com');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  // VU continues even if check fails
}
```

### ❌ Don't: Generate Random Data Inefficiently

```javascript
// This is slow
export default function() {
  const randomEmail = generateComplexRandomEmail(); // Complex generation
}
```

### ✅ Do: Pre-generate Data or Use Simple Randomization

```javascript
// Pre-generated data
const emails = new SharedArray('emails', function() {
  return generateEmails(1000); // Generate once
});

export default function() {
  const email = emails[Math.floor(Math.random() * emails.length)];
}
```

### ❌ Don't: Forget to Add Sleep

```javascript
export default function() {
  http.get('https://api.example.com');
  // No sleep - unrealistic!
}
```

### ✅ Do: Add Realistic Think Time

```javascript
export default function() {
  http.get('https://api.example.com');
  sleep(1 + Math.random() * 2); // 1-3 seconds
}
```

## Additional Resources

- [k6 Official Docs](https://grafana.com/docs/k6/latest/)
- [k6 Best Practices](https://grafana.com/docs/k6/latest/misc/fine-tuning-os/)
- [k6 Examples](https://grafana.com/docs/k6/latest/examples/)
- [k6 Community](https://community.grafana.com/c/grafana-k6/)

---

Following these best practices will help you create effective, maintainable, and performant load tests! 🚀
