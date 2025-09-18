import React, { useState } from "react";
import "./App.css";

function App() {
  const [users] = useState(["Alice", "Bob", "Charlie", "David"]);
  const [selectedUser, setSelectedUser] = useState("Alice");

  const [messages, setMessages] = useState({
    Alice: [{ text: "Hi! I'm Alice", sender: "other" }],
    Bob: [{ text: "Hey! Bob here", sender: "other" }],
    Charlie: [{ text: "Hello from Charlie", sender: "other" }],
    David: [{ text: "David joined the chat", sender: "other" }],
  });

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [...prev[selectedUser], { text: newMessage, sender: "me" }],
    }));

    setNewMessage("");
  };

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">ChatApp</h2>
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className={user === selectedUser ? "active" : ""}
              onClick={() => setSelectedUser(user)}
            >
              <div className="user-avatar">{user.charAt(0)}</div>
              <span>{user}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-user">
            <div className="user-avatar big">{selectedUser.charAt(0)}</div>
            <span>{selectedUser}</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages[selectedUser]?.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === "me" ? "sent" : "received"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default App;
