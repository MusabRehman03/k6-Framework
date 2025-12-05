/**
 * File Upload Testing Example
 * 
 * Demonstrates how to test file upload endpoints with k6
 * Run: k6 run examples/file-upload-example.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../utils/summary.js';

export const options = {
  vus: 5,
  duration: '30s',
  
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // File uploads can be slower
    'http_req_failed': ['rate<0.05'],
  },
  
  tags: {
    test_type: 'example',
    test_name: 'file-upload-example',
  },
};

export default function () {
  // Create a multipart form data request
  const binFile = open('/path/to/file.bin', 'b'); // Binary file
  
  // For this example, we'll simulate with JSON data
  const data = {
    field: 'value',
    file: http.file('test.txt', 'This is test file content', 'text/plain'),
  };
  
  const res = http.post('https://test-api.k6.io/user/register/', JSON.stringify({
    username: `user_${__VU}_${__ITER}`,
    first_name: 'Test',
    last_name: 'User',
    email: `user${__VU}@example.com`,
    password: 'Test123!',
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  check(res, {
    'upload successful': (r) => r.status === 200 || r.status === 201,
  });
  
  sleep(1);
}

export { handleSummary };

/**
 * Real file upload example:
 * 
 * import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
 * 
 * export default function() {
 *   const fd = new FormData();
 *   const fileContent = open('./file.pdf', 'b');
 *   
 *   fd.append('file', http.file(fileContent, 'document.pdf', 'application/pdf'));
 *   fd.append('description', 'Test upload');
 *   
 *   const res = http.post('https://api.example.com/upload', fd.body(), {
 *     headers: { 'Content-Type': 'multipart/form-data; boundary=' + fd.boundary },
 *   });
 * }
 */
