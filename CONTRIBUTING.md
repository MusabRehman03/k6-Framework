# Contributing to k6 Framework

Thank you for your interest in contributing to the k6 Framework! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in [GitHub Issues](https://github.com/MusabRehman03/k6-Framework/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (OS, k6 version)

### Submitting Changes

1. **Fork the repository**
   ```bash
   # Click 'Fork' on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/k6-Framework.git
   cd k6-Framework
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add/update tests as needed
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Run the relevant tests
   k6 run tests/smoke/basic-http-test.js
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: description of your changes"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Then create a PR on GitHub
   ```

## Code Style Guidelines

### JavaScript/k6 Scripts

- Use ES6+ syntax
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use consistent indentation (2 spaces)

Example:
```javascript
/**
 * Generate a random email address
 * @param {string} domain - Email domain (default: example.com)
 * @returns {string} - Random email
 */
export function randomEmail(domain = 'example.com') {
  return `user_${randomString(8)}@${domain}`;
}
```

### Test Scripts

- Include descriptive comments
- Use meaningful test names
- Group related checks
- Include thresholds
- Export handleSummary for reports

Example:
```javascript
/**
 * User registration test
 * 
 * Tests the user registration flow with various scenarios
 * Run: k6 run tests/scenarios/user-registration.js
 */

import { check, group } from 'k6';
import { handleSummary } from '../../utils/summary.js';

export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    'http_req_duration': ['p(95)<500'],
  },
};

export default function() {
  group('User Registration', function() {
    // Test logic here
  });
}

export { handleSummary };
```

### Configuration Files

- Use clear, descriptive option names
- Include comments explaining each section
- Set realistic thresholds
- Tag appropriately

## Adding New Features

### New Test Examples

1. Place in appropriate directory:
   - `tests/smoke/` - Smoke tests
   - `tests/load/` - Load tests
   - `tests/stress/` - Stress tests
   - `tests/scenarios/` - Scenario-based tests

2. Follow the template:
   ```javascript
   import { handleSummary } from '../../utils/summary.js';
   
   export const options = {
     // Configuration
   };
   
   export default function() {
     // Test logic
   }
   
   export { handleSummary };
   ```

3. Update README.md with usage example

### New Helper Functions

1. Place in `utils/helpers/`
2. Add JSDoc comments
3. Export the function
4. Add usage example in comments

### New Configurations

1. Place in `config/`
2. Follow existing naming pattern
3. Include all necessary options
4. Update config/index.js if needed

## Documentation

When adding features, update:

- README.md - Main documentation
- QUICKSTART.md - If it affects getting started
- BEST_PRACTICES.md - If introducing new patterns
- Inline comments - For complex logic

## Testing Your Contributions

Before submitting:

1. **Test your code**
   ```bash
   k6 run your-new-test.js
   ```

2. **Verify HTML reports generate**
   ```bash
   # Report should be in reports/summary.html
   ls -la reports/
   ```

3. **Check for errors**
   - No JavaScript errors
   - All checks pass (or expected failures documented)
   - Report generates correctly

4. **Test edge cases**
   - Different environments
   - Various load levels
   - Error conditions

## Pull Request Guidelines

### Good PR Title Examples

- ✅ "Add GraphQL testing example"
- ✅ "Fix threshold configuration in load test"
- ✅ "Update README with Docker instructions"
- ❌ "Update files"
- ❌ "Fix bug"

### PR Description Should Include

- What changed and why
- How to test the changes
- Any breaking changes
- Screenshots (if applicable)

Example:
```markdown
## Description
Added a new helper function for generating random product data.

## Changes
- Added `randomProduct()` to utils/helpers/common.js
- Added example usage in tests/scenarios/product-test.js
- Updated README with new helper documentation

## Testing
```bash
k6 run tests/scenarios/product-test.js
```

## Breaking Changes
None
```

## Types of Contributions We're Looking For

- **Test Examples**: New test scenarios and patterns
- **Helper Functions**: Useful utilities for common tasks
- **Configuration Templates**: Environment-specific configs
- **Documentation**: Improvements and clarifications
- **Bug Fixes**: Corrections to existing code
- **Performance Improvements**: Optimizations

## Questions?

- Open an issue for discussion
- Check [k6 Documentation](https://grafana.com/docs/k6/latest/)
- Join [k6 Community](https://community.grafana.com/c/grafana-k6/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
