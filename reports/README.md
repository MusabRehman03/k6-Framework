# Reports Directory

This directory will contain the generated HTML and JSON reports from your k6 test runs.

## Generated Files

- `summary.html` - Visual HTML report with graphs and metrics
- `summary.json` - Raw JSON data from the test run

## Viewing Reports

After running a test, open `summary.html` in your web browser to view the detailed report with:
- Request metrics and timings
- Success/failure rates
- Custom metrics
- Charts and visualizations

## Note

These files are automatically generated and should not be committed to version control (they are listed in `.gitignore`).
