# k6 Framework - Performance Testing Starter Kit

A comprehensive, production-ready k6 framework for performance and load testing. This starter kit follows k6 best practices and includes integrated HTML reporting using [k6-reporter](https://github.com/benc-uk/k6-reporter).

## 🚀 Features

- **Structured Framework**: Organized directory structure following k6 best practices
- **HTML Reporting**: Automatic HTML report generation for every test run
- **Multiple Test Types**: Examples for smoke, load, stress, and scenario testing
- **Custom Metrics**: Helper functions for creating and tracking custom metrics
- **Environment Configs**: Separate configurations for dev, staging, and production
- **Helper Utilities**: Reusable functions for common testing tasks
- **Data-Driven Testing**: Examples of using external data files
- **Authentication Examples**: Sample tests showing auth flows
- **Best Practices**: Implements k6 recommended patterns and practices

## 📁 Project Structure

```
k6-Framework/
├── config/                 # Environment configurations
│   ├── base.config.js     # Base configuration
│   ├── dev.config.js      # Development environment
│   ├── staging.config.js  # Staging environment
│   └── prod.config.js     # Production environment
├── data/                   # Test data files
│   └── users.json         # Sample user data
├── tests/                  # Test scripts
│   ├── smoke/             # Smoke tests
│   │   └── basic-http-test.js
│   ├── load/              # Load tests
│   │   └── advanced-load-test.js
│   ├── stress/            # Stress tests
│   │   └── stress-test.js
│   └── scenarios/         # Scenario-based tests
│       ├── auth-example.js
│       └── data-driven-test.js
├── utils/                  # Helper utilities
│   ├── summary.js         # HTML report generation
│   └── helpers/
│       ├── common.js      # Common helper functions
│       └── metrics.js     # Custom metrics helpers
└── reports/               # Generated test reports
    ├── summary.html       # HTML report (auto-generated)
    └── summary.json       # JSON report (auto-generated)
```

## 🛠️ Prerequisites

1. **Install k6**: Follow the [official installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)

   ```bash
   # macOS (using Homebrew)
   brew install k6

   # Windows (using Chocolatey)
   choco install k6

   # Linux (Debian/Ubuntu)
   sudo gpg -k
   sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6

   # Docker
   docker pull grafana/k6:latest
   ```

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MusabRehman03/k6-Framework.git
cd k6-Framework
```

### 2. Run Your First Test

```bash
# Run a simple smoke test
k6 run tests/smoke/basic-http-test.js

# Run an advanced load test
k6 run tests/load/advanced-load-test.js

# Run a stress test
k6 run tests/stress/stress-test.js
```

### 3. View the HTML Report

After running any test, open the generated HTML report:

```bash
# The report is automatically generated at:
open reports/summary.html
```

## 📊 Test Types

### Smoke Tests
Quick tests to verify basic functionality with minimal load.

```bash
k6 run tests/smoke/basic-http-test.js
```

**Use Case**: Verify the system works before running larger tests.

### Load Tests
Test the system's performance under expected load conditions.

```bash
k6 run tests/load/advanced-load-test.js
```

**Use Case**: Verify performance under normal and peak load.

### Stress Tests
Push the system beyond normal capacity to find breaking points.

```bash
k6 run tests/stress/stress-test.js
```

**Use Case**: Identify system limits and breaking points.

### Scenario Tests
Test specific user journeys or workflows.

```bash
k6 run tests/scenarios/auth-example.js
k6 run tests/scenarios/data-driven-test.js
```

**Use Case**: Test realistic user behaviors and workflows.

## 🎯 Creating Your Own Tests

### Basic Test Template

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../utils/summary.js';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://your-api.com/endpoint');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}

// Enable HTML reporting
export { handleSummary };
```

### Using Environment Configurations

```javascript
import { devConfig } from '../config/dev.config.js';

export const options = {
  ...devConfig,
  // Override specific settings
  duration: '2m',
};
```

### Using Helper Functions

```javascript
import { randomEmail, randomString, randomInt } from '../utils/helpers/common.js';
import { createCustomMetrics, recordResponseMetrics } from '../utils/helpers/metrics.js';

export default function () {
  // Generate random data
  const email = randomEmail();
  const username = randomString(10);
  const age = randomInt(18, 80);
  
  // Use custom metrics
  const metrics = createCustomMetrics();
  recordResponseMetrics(metrics, response);
}
```

## 📈 HTML Reporting

Every test automatically generates an HTML report thanks to the integrated [k6-reporter](https://github.com/benc-uk/k6-reporter). The report includes:

- **Summary Statistics**: Overview of test results
- **Response Time Graphs**: Visual representation of performance
- **Request Metrics**: Detailed request/response data
- **Threshold Status**: Pass/fail status of defined thresholds
- **Custom Metrics**: Any custom metrics you've defined

To enable reporting in your tests, simply import and export the `handleSummary` function:

```javascript
import { handleSummary } from '../utils/summary.js';

// Your test code here...

export { handleSummary };
```

## 🔧 Advanced Configuration

### Environment Variables

Use environment variables to configure your tests:

```bash
# Set base URL
k6 run -e BASE_URL=https://api.staging.example.com tests/smoke/basic-http-test.js

# Set multiple variables
k6 run -e BASE_URL=https://api.example.com -e API_KEY=your-key tests/load/advanced-load-test.js
```

Access in your test:

```javascript
const baseURL = __ENV.BASE_URL || 'https://default-url.com';
```

### Custom Thresholds

Define performance criteria:

```javascript
export const options = {
  thresholds: {
    // 95% of requests must complete within 500ms
    'http_req_duration': ['p(95)<500'],
    
    // 99% of requests must complete within 1s
    'http_req_duration{expected_response:true}': ['p(99)<1000'],
    
    // Error rate must be below 1%
    'http_req_failed': ['rate<0.01'],
    
    // At least 100 requests per second
    'http_reqs': ['rate>100'],
  },
};
```

### Multiple Scenarios

Run different test patterns simultaneously:

```javascript
export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 5,
      duration: '1m',
      exec: 'smokeTest',
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 },
      ],
      exec: 'stressTest',
      startTime: '1m', // Start after smoke test
    },
  },
};

export function smokeTest() {
  // Smoke test logic
}

export function stressTest() {
  // Stress test logic
}
```

## 📚 Best Practices Implemented

1. **Modular Structure**: Separate concerns (tests, configs, utilities)
2. **Reusable Components**: Helper functions and custom metrics
3. **Environment Separation**: Different configs for different environments
4. **Realistic Load Patterns**: Use appropriate executors for test scenarios
5. **Think Time**: Include sleep() to simulate real user behavior
6. **Checks and Thresholds**: Validate responses and define SLOs
7. **Groups**: Organize related requests for better reporting
8. **Custom Metrics**: Track business-specific KPIs
9. **Data Management**: Use SharedArray for efficient data handling
10. **Graceful Ramp Down**: Prevent abrupt test termination

## 🎓 Learning Resources

- [k6 Official Documentation](https://grafana.com/docs/k6/latest/)
- [k6 Examples](https://grafana.com/docs/k6/latest/examples/)
- [k6 Best Practices](https://grafana.com/docs/k6/latest/misc/fine-tuning-os/)
- [k6 Cloud](https://grafana.com/products/cloud/k6/)
- [k6 Community Forum](https://community.grafana.com/c/grafana-k6/)

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [k6](https://k6.io/) - Modern load testing tool
- [k6-reporter](https://github.com/benc-uk/k6-reporter) - HTML reporting for k6
- [Grafana](https://grafana.com/) - Maintainers of k6

---

**Happy Load Testing! 🚀**