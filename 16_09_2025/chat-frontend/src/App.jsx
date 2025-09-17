import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const clientId = useRef(Date.now()); // unique id per tab

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Only add messages from others or system
        if (data.sender !== clientId.current || data.system) {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socketRef.current.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      const msg = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        sender: clientId.current,
      };

      // Show message immediately
      setMessages((prev) => [...prev, msg]);

      // Send to server
      socketRef.current.send(JSON.stringify(msg));
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <h2>💬 Chat App</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.system ? "system" : ""}`}
          >
            <span className="time">{msg.timestamp}:</span>{" "}
            <span className="text">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
