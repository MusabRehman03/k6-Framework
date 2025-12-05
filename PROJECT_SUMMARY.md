# Project Summary - k6 Framework Starter Kit

## Overview

This is a comprehensive, production-ready k6 performance testing framework that implements industry best practices and includes integrated HTML reporting.

## What's Included

### 📁 Directory Structure

```
k6-Framework/
├── config/              # Environment-specific configurations
├── data/                # Test data files
├── examples/            # Additional testing pattern examples
├── reports/             # Auto-generated HTML and JSON reports
├── tests/               # Main test suite
│   ├── smoke/          # Quick verification tests
│   ├── load/           # Performance under load
│   ├── stress/         # System limits testing
│   └── scenarios/      # User journey tests
└── utils/              # Reusable helper functions
```

### 🎯 Key Features

1. **Integrated HTML Reporting**: Every test automatically generates beautiful HTML reports using k6-reporter
2. **Multiple Test Types**: Smoke, load, stress, and scenario-based tests
3. **Environment Configurations**: Separate configs for dev, staging, and production
4. **Helper Utilities**: Common functions for data generation, metrics, and more
5. **Best Practices**: Implements k6 recommended patterns throughout
6. **Data-Driven Testing**: Examples using external JSON data
7. **Advanced Scenarios**: E-commerce journey, authentication flows, and more
8. **WebSocket & GraphQL Support**: Examples for modern API patterns

### 📊 Test Examples

#### Basic Tests
- **Smoke Test**: Quick health check with minimal load
- **Load Test**: Multiple scenarios with ramping and constant load
- **Stress Test**: Find system breaking points

#### Scenario Tests
- **Authentication**: Login and registration flows
- **Data-Driven**: Using external data sources
- **E-commerce Journey**: Complete user shopping flow
- **WebSocket**: Real-time communication testing
- **GraphQL**: Modern API query testing
- **File Upload**: Multipart form data handling

### 🛠️ Utilities

#### Common Helpers (`utils/helpers/common.js`)
- Random string, email, integer generation
- User data generators
- Response validation helpers
- Formatting utilities

#### Metrics Helpers (`utils/helpers/metrics.js`)
- Custom metric creation
- Transaction tracking
- Business metric recording
- Performance monitoring

#### Summary Handler (`utils/summary.js`)
- Automatic HTML report generation
- JSON export for analysis
- Console output formatting

### ⚙️ Configurations

#### Base Config (`config/base.config.js`)
- Default test settings
- Standard thresholds
- Common tags and options

#### Environment Configs
- **Dev**: Lower thresholds, small load
- **Staging**: Medium load, realistic thresholds
- **Production**: High load, strict thresholds

### 📝 Documentation

1. **README.md**: Complete framework documentation
2. **QUICKSTART.md**: Get started in 5 minutes
3. **BEST_PRACTICES.md**: k6 best practices guide
4. **CONTRIBUTING.md**: Contribution guidelines
5. **LICENSE**: MIT License

### 🚀 Running Tests

#### Using npm scripts:
```bash
npm run test:smoke          # Run smoke test
npm run test:load           # Run load test
npm run test:stress         # Run stress test
npm run test:journey        # Run e-commerce journey
npm run report              # View HTML report
```

#### Using the helper script:
```bash
./run-tests.sh smoke                    # Basic smoke test
./run-tests.sh load --vus 50            # Load test with 50 VUs
./run-tests.sh stress --duration 10m    # 10-minute stress test
./run-tests.sh report                   # Open HTML report
```

#### Direct k6 commands:
```bash
k6 run tests/smoke/basic-http-test.js
k6 run tests/load/advanced-load-test.js
k6 run tests/scenarios/ecommerce-journey.js
```

### 📈 HTML Reporting

Every test automatically generates:
- **reports/summary.html**: Visual report with graphs
- **reports/summary.json**: Raw data for further analysis

Reports include:
- Summary statistics
- Response time graphs
- Request metrics
- Threshold pass/fail status
- Custom metrics visualization

### 🎓 Learning Path

1. Start with **QUICKSTART.md** to set up
2. Run **basic-http-test.js** to see it in action
3. Study **advanced-load-test.js** for complex scenarios
4. Review **BEST_PRACTICES.md** for optimization
5. Explore **examples/** for specific patterns
6. Create your own tests using the templates

### 🔧 Customization

#### Create New Test
1. Copy a template from `tests/`
2. Modify for your API endpoints
3. Add custom checks and thresholds
4. Include `handleSummary` for reports

#### Add Helper Function
1. Add to `utils/helpers/common.js`
2. Export the function
3. Document with JSDoc comments
4. Import in your tests

#### Environment Configuration
1. Copy existing config from `config/`
2. Modify thresholds and settings
3. Use with `-e ENVIRONMENT=your_env`

### 🎯 Use Cases

This framework is ideal for:
- **API Performance Testing**: REST, GraphQL, WebSocket APIs
- **Load Testing**: Verify system handles expected traffic
- **Stress Testing**: Find system limits and breaking points
- **Regression Testing**: Ensure performance doesn't degrade
- **CI/CD Integration**: Automated performance checks
- **Capacity Planning**: Understand system scalability

### 🔄 CI/CD Integration

Easy to integrate with:
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI
- Travis CI

Example GitHub Actions:
```yaml
- name: Run k6 Load Test
  run: |
    k6 run tests/load/advanced-load-test.js
    
- name: Upload Report
  uses: actions/upload-artifact@v2
  with:
    name: k6-report
    path: reports/summary.html
```

### 📦 Dependencies

**Required:**
- k6 (v0.40.0 or later)

**Optional:**
- Node.js (for npm scripts)
- Git (for version control)

### 🤝 Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

### 📄 License

MIT License - see LICENSE file for details.

### 🙏 Credits

Built with:
- [k6](https://k6.io/) - Modern load testing tool
- [k6-reporter](https://github.com/benc-uk/k6-reporter) - HTML reporting
- [Grafana](https://grafana.com/) - k6 maintainers

### 📞 Support

- Documentation: See README.md and other docs
- Issues: GitHub Issues
- k6 Community: https://community.grafana.com/c/grafana-k6/
- k6 Docs: https://grafana.com/docs/k6/latest/

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
