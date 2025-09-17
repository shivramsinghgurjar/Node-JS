// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected ✅");

  // Send welcome message to new client
  ws.send(
    JSON.stringify({
      text: "Welcome to the chat!",
      timestamp: new Date().toLocaleTimeString(),
      system: true,
    })
  );

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    let parsed;
    try {
      parsed = JSON.parse(message.toString());
    } catch (err) {
      console.error("Invalid JSON:", err);
      return;
    }

    // Add server timestamp
    parsed.timestamp = new Date().toLocaleTimeString();

    // Broadcast parsed JSON to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsed));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected ❌");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running at ws://localhost:${PORT}`);
});
