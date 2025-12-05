# k6 Examples

This directory contains additional examples demonstrating various k6 testing patterns and features.

## Available Examples

### 1. WebSocket Testing (`websocket-example.js`)

Demonstrates how to test WebSocket connections:
- Connecting to WebSocket servers
- Sending and receiving messages
- Handling WebSocket events
- Testing real-time communication

**Run:**
```bash
k6 run examples/websocket-example.js
```

**Use Cases:**
- Chat applications
- Real-time dashboards
- Live notifications
- Gaming backends

### 2. GraphQL Testing (`graphql-example.js`)

Shows how to test GraphQL APIs:
- Sending GraphQL queries
- Handling GraphQL responses
- Checking for errors
- Testing mutations and subscriptions

**Run:**
```bash
k6 run examples/graphql-example.js
```

**Use Cases:**
- GraphQL API testing
- Schema validation
- Query performance testing
- Mutation testing

### 3. File Upload Testing (`file-upload-example.js`)

Demonstrates file upload testing:
- Multipart form data
- Binary file uploads
- File upload validation
- Large file handling

**Run:**
```bash
k6 run examples/file-upload-example.js
```

**Use Cases:**
- Document upload systems
- Image/video upload services
- Attachment functionality
- Bulk upload testing

## How to Use These Examples

1. **Study the Code**: Each example is well-commented to explain the concepts
2. **Modify for Your Needs**: Adapt the examples to test your own APIs
3. **Combine Patterns**: Mix and match patterns from different examples
4. **Extend**: Add your own custom logic and validations

## Creating Your Own Examples

When creating new examples:

1. Add clear comments explaining the pattern
2. Include usage instructions
3. Add realistic thresholds
4. Export `handleSummary` for HTML reports
5. Add an entry to this README

## Additional Resources

- [k6 Examples Gallery](https://grafana.com/docs/k6/latest/examples/)
- [k6 API Documentation](https://grafana.com/docs/k6/latest/javascript-api/)
- [k6 Community Examples](https://community.grafana.com/c/grafana-k6/)

## Need More Examples?

Check the `tests/` directory for complete test scenarios:
- Smoke tests
- Load tests
- Stress tests
- User journey scenarios
