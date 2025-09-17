# Real-time Chat Application

A real-time chat application built with Node.js, Express, WebSockets, and React.

## Features

- **Real-time messaging** using WebSockets
- **Multi-user support** with username identification
- **Connection status** indicator
- **Auto-reconnection** capability
- **Responsive design** for mobile and desktop
- **Clean, modern UI** with smooth animations
- **Message timestamps** and system notifications
- **Enter key** support for sending messages

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **ws** - WebSocket library
- **HTTP Server** - For WebSocket integration

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

## Project Structure

```
17_09_2025_ChatApp/
├── server.js              # Backend server with WebSocket
├── package.json           # Backend dependencies
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main chat component
│   │   ├── App.css        # Chat application styles
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Backend Setup

1. Navigate to the project root:
   ```bash
   cd 17_09_2025_ChatApp
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```
   
   The server will run on `http://localhost:5000`
   WebSocket server will be available at `ws://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

## Usage

1. **Start the backend server** in one terminal:
   ```bash
   node server.js
   ```

2. **Start the frontend** in another terminal:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and go to `http://localhost:5173`

4. **Enter your username** when prompted

5. **Start chatting!** Type messages and press Enter or click Send

## Features in Detail

### Backend Features
- **WebSocket Server**: Handles real-time connections
- **Message Broadcasting**: Sends messages to all connected clients
- **Connection Logging**: Logs all connection events
- **Error Handling**: Graceful error handling and recovery
- **Health Check**: `/health` endpoint for monitoring

### Frontend Features
- **Username Modal**: Prompts for username before joining
- **Real-time Updates**: Messages appear instantly
- **Connection Status**: Shows if connected/disconnected
- **Auto-scroll**: Automatically scrolls to latest messages
- **Responsive Design**: Works on mobile and desktop
- **Message Types**: Different styling for user and system messages

## API Endpoints

- `GET /` - Server status and info
- `GET /health` - Health check endpoint
- `WebSocket ws://localhost:5000` - Real-time messaging

## WebSocket Message Format

### Client to Server
```json
{
  "message": "Hello everyone!",
  "username": "John"
}
```

### Server to Client
```json
{
  "type": "chat",
  "message": "Hello everyone!",
  "username": "John",
  "timestamp": "2025-01-17T10:30:00.000Z",
  "clientId": "abc123"
}
```

### System Messages
```json
{
  "type": "system",
  "message": "Welcome to the chat!",
  "timestamp": "2025-01-17T10:30:00.000Z"
}
```

## Development

### Backend Development
- Use `nodemon` for auto-restart during development:
  ```bash
  npm run dev
  ```

### Frontend Development
- Vite provides hot module replacement
- Changes are reflected immediately in the browser

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure backend server is running on port 5000
   - Check firewall settings
   - Verify no other service is using port 5000

2. **Frontend Not Loading**
   - Ensure frontend dependencies are installed
   - Check if port 5173 is available
   - Try clearing browser cache

3. **Messages Not Sending**
   - Check WebSocket connection status
   - Verify backend server is running
   - Check browser console for errors

### Port Configuration

- **Backend**: Port 5000 (configurable via PORT environment variable)
- **Frontend**: Port 5173 (Vite default)

## License

MIT License - feel free to use this project for learning and development!
