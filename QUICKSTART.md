# Quick Start Guide

This guide will help you get started with the k6 Framework in under 5 minutes.

## Step 1: Install k6

Choose your platform:

### macOS
```bash
brew install k6
```

### Windows
```bash
choco install k6
```

### Linux (Debian/Ubuntu)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Docker
```bash
docker pull grafana/k6:latest
```

## Step 2: Clone the Repository

```bash
git clone https://github.com/MusabRehman03/k6-Framework.git
cd k6-Framework
```

## Step 3: Run Your First Test

```bash
k6 run tests/smoke/basic-http-test.js
```

You should see output like this:

```
     ✓ status is 200
     ✓ response time < 500ms
     ✓ has crocodiles

     █ User Journey - Browse and View
       ✓ detail status is 200
       ✓ has crocodile details
```

## Step 4: View the HTML Report

After the test completes, open the generated report:

```bash
# macOS
open reports/summary.html

# Linux
xdg-open reports/summary.html

# Windows
start reports/summary.html
```

Or use npm script:
```bash
npm run report
```

## Step 5: Customize Your First Test

Create a new test file `tests/my-first-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../utils/summary.js';

export const options = {
  vus: 5,        // 5 virtual users
  duration: '30s', // Run for 30 seconds
};

export default function () {
  // Replace with your API endpoint
  const res = http.get('https://your-api.com/endpoint');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}

export { handleSummary };
```

Run it:
```bash
k6 run tests/my-first-test.js
```

## Next Steps

1. **Explore Example Tests**: Check out the tests in `tests/` directory
2. **Read the Main README**: Learn about all features in the main README.md
3. **Customize Configurations**: Modify configs in `config/` for your environment
4. **Use Helper Functions**: Leverage utilities in `utils/helpers/`
5. **Add Test Data**: Put your test data in `data/` directory

## Common Commands

```bash
# Run smoke test
npm run test:smoke

# Run load test
npm run test:load

# Run stress test
npm run test:stress

# Run with custom environment
k6 run -e BASE_URL=https://staging.example.com tests/smoke/basic-http-test.js

# Run with more VUs
k6 run --vus 20 --duration 1m tests/smoke/basic-http-test.js

# Run with Docker
docker run --rm -i -v $(pwd):/workspace grafana/k6:latest run /workspace/tests/smoke/basic-http-test.js
```

## Troubleshooting

**Issue**: k6 command not found
- Solution: Make sure k6 is installed and in your PATH

**Issue**: Import errors
- Solution: Make sure you're running k6 from the project root directory

**Issue**: Cannot open HTML report
- Solution: Check that the test completed successfully and `reports/summary.html` was generated

## Getting Help

- [k6 Documentation](https://grafana.com/docs/k6/latest/)
- [k6 Community Forum](https://community.grafana.com/c/grafana-k6/)
- [GitHub Issues](https://github.com/MusabRehman03/k6-Framework/issues)

Happy Testing! 🚀
