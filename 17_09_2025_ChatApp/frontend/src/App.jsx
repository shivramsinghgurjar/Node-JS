import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket('ws://localhost:5000');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUsernameModal(false);
      connectWebSocket();
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && ws.current && isConnected) {
      const message = {
        message: inputMessage.trim(),
        username: username
      };
      ws.current.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  const reconnect = () => {
    connectWebSocket();
  };

  return (
    <div className="app">
      {showUsernameModal ? (
        <div className="username-modal">
          <div className="username-modal-content">
            <h2>Welcome to Chat App</h2>
            <p>Enter your username to start chatting</p>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                maxLength={20}
                required
                autoFocus
              />
              <button type="submit">Join Chat</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h1>💬 Real-time Chat</h1>
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
              {!isConnected && (
                <button onClick={reconnect} className="reconnect-btn">
                  Reconnect
                </button>
              )}
            </div>
          </div>

          <div className="messages-container">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type === 'system' ? 'system-message' : 'user-message'}`}>
                  {msg.type === 'system' ? (
                    <div className="system-msg">
                      <span className="system-text">{msg.message}</span>
                      <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ) : (
                    <div className="user-msg">
                      <div className="message-header">
                        <span className="username">{msg.username}</span>
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <div className="input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected}
                maxLength={500}
              />
              <button type="submit" disabled={!isConnected || !inputMessage.trim()}>
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;