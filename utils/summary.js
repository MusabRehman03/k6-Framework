import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

/**
 * Handle summary for k6 tests
 * Generates both HTML and JSON reports
 * @param {object} data - Summary data from k6
 * @returns {object} - Report configuration
 */
export function handleSummary(data) {
  return {
    "reports/summary.html": htmlReport(data),
    "reports/summary.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

/**
 * Custom handle summary with custom title
 * @param {object} data - Summary data from k6
 * @param {string} title - Custom title for the report
 * @returns {object} - Report configuration
 */
export function handleSummaryWithTitle(data, title) {
  return {
    "reports/summary.html": htmlReport(data, { title: title }),
    "reports/summary.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
