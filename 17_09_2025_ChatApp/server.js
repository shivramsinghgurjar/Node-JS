const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const clientId = Math.random().toString(36).substr(2, 9);
  clients.add(ws);
  
  console.log(`✅ Client connected: ${clientId} (Total clients: ${clients.size})`);
  
  // Send welcome message to the connected client
  ws.send(JSON.stringify({
    type: 'system',
    message: 'Welcome to the chat!',
    timestamp: new Date().toISOString(),
    clientId: clientId
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`📨 Message from ${clientId}: ${message.message}`);
      
      // Broadcast message to all connected clients
      const broadcastMessage = {
        type: 'chat',
        message: message.message,
        username: message.username || 'Anonymous',
        timestamp: new Date().toISOString(),
        clientId: clientId
      };
      
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(broadcastMessage));
        }
      });
      
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`❌ Client disconnected: ${clientId} (Total clients: ${clients.size})`);
    
    // Notify other clients about disconnection
    const disconnectMessage = {
      type: 'system',
      message: 'A user has left the chat',
      timestamp: new Date().toISOString()
    };
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(disconnectMessage));
      }
    });
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    clients.delete(ws);
  });
});

// Express routes
app.get('/', (req, res) => {
  res.json({
    message: 'Real-time Chat Server',
    status: 'running',
    websocket: 'ws://localhost:5000',
    clients: clients.size
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    clients: clients.size
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
