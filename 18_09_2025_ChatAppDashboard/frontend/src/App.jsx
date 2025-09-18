import React, { useState, useEffect } from "react";
import "./App.css";

// --- API helper functions ---
const API_URL = "http://localhost:5000/api";

const signup = async (username, email, password) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};

const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

// --- Input Field Component ---
function InputField({ label, type, value, onChange }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

// --- Signup Component ---
function Signup({ onSwitch, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = await signup(username, email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } else {
      alert(data.msg || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <InputField label="Username" type="text" value={username} onChange={setUsername} />
        <InputField label="Email" type="email" value={email} onChange={setEmail} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <span className="switch" onClick={onSwitch}>
          Login
        </span>
      </p>
    </div>
  );
}

// --- Login Component ---
function Login({ onSwitch, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await login(username, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } else {
      alert(data.msg || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <InputField label="Username" type="text" value={username} onChange={setUsername} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <span className="switch" onClick={onSwitch}>
          Sign Up
        </span>
      </p>
    </div>
  );
}

// --- Main App ---
function App() {
  // Auth State
  const [showLogin, setShowLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Chat State
  const [users] = useState(["Alice", "Bob", "Charlie", "David"]);
  const [selectedUser, setSelectedUser] = useState("Alice");

  const [messages, setMessages] = useState({
    Alice: [{ text: "Hi! I'm Alice", sender: "other" }],
    Bob: [{ text: "Hey! Bob here", sender: "other" }],
    Charlie: [{ text: "Hello from Charlie", sender: "other" }],
    David: [{ text: "David joined the chat", sender: "other" }],
  });

  const [newMessage, setNewMessage] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [...prev[selectedUser], { text: newMessage, sender: "me" }],
    }));
    setNewMessage("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // If not logged in, show login/signup
  if (!currentUser) {
    return showLogin ? (
      <Login
        onSwitch={() => setShowLogin(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    ) : (
      <Signup
        onSwitch={() => setShowLogin(true)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    );
  }

  // If logged in, show chat app
  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">ChatApp</h2>
        <p style={{ color: "lightgray", marginBottom: "10px" }}>
          Logged in as: <b>{currentUser.username}</b>
        </p>
        <button onClick={logout} style={{ marginBottom: "15px" }}>
          Logout
        </button>
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












// ChatApp Dashboard



// import React, { useState } from "react";
// import "./App.css";

// function App() {
//   const [users] = useState(["Alice", "Bob", "Charlie", "David"]);
//   const [selectedUser, setSelectedUser] = useState("Alice");

//   const [messages, setMessages] = useState({
//     Alice: [{ text: "Hi! I'm Alice", sender: "other" }],
//     Bob: [{ text: "Hey! Bob here", sender: "other" }],
//     Charlie: [{ text: "Hello from Charlie", sender: "other" }],
//     David: [{ text: "David joined the chat", sender: "other" }],
//   });

//   const [newMessage, setNewMessage] = useState("");

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     setMessages((prev) => ({
//       ...prev,
//       [selectedUser]: [...prev[selectedUser], { text: newMessage, sender: "me" }],
//     }));

//     setNewMessage("");
//   };

//   return (
//     <div className="chat-app">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2 className="logo">ChatApp</h2>
//         <ul>
//           {users.map((user, index) => (
//             <li
//               key={index}
//               className={user === selectedUser ? "active" : ""}
//               onClick={() => setSelectedUser(user)}
//             >
//               <div className="user-avatar">{user.charAt(0)}</div>
//               <span>{user}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Area */}
//       <div className="chat-area">
//         <div className="chat-header">
//           <div className="chat-user">
//             <div className="user-avatar big">{selectedUser.charAt(0)}</div>
//             <span>{selectedUser}</span>
//           </div>
//         </div>

//         <div className="chat-messages">
//           {messages[selectedUser]?.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`message ${msg.sender === "me" ? "sent" : "received"}`}
//             >
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         <div className="chat-input">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button onClick={sendMessage}>➤</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
