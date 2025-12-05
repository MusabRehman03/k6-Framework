/**
 * WebSocket Testing Example
 * 
 * Demonstrates how to test WebSocket connections with k6
 * Run: k6 run examples/websocket-example.js
 */

import { check } from 'k6';
import ws from 'k6/ws';
import { handleSummary } from '../utils/summary.js';

export const options = {
  vus: 10,
  duration: '30s',
  
  thresholds: {
    'ws_connecting': ['p(95)<1000'],
    'ws_msgs_received': ['count>50'],
  },
  
  tags: {
    test_type: 'example',
    test_name: 'websocket-example',
  },
};

export default function () {
  const url = 'wss://test-api.k6.io/ws/crocochat/publicRoom/';
  const params = { tags: { my_tag: 'websocket' } };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      console.log('Connected to WebSocket');
      
      // Send a message
      socket.send(JSON.stringify({ 
        event: 'SET_NAME', 
        new_name: `K6_User_${__VU}` 
      }));
      
      // Send a chat message
      socket.send(JSON.stringify({ 
        event: 'SAY', 
        message: 'Hello from k6!' 
      }));
      
      // Schedule close after 10 seconds
      socket.setTimeout(function () {
        console.log('Closing WebSocket connection');
        socket.close();
      }, 10000);
    });

    socket.on('message', function (message) {
      console.log(`Received: ${message}`);
    });

    socket.on('close', function () {
      console.log('Disconnected from WebSocket');
    });

    socket.on('error', function (e) {
      if (e.error() != 'websocket: close sent') {
        console.log('WebSocket error: ', e.error());
      }
    });
  });

  check(res, { 
    'status is 101': (r) => r && r.status === 101 
  });
}

export { handleSummary };
