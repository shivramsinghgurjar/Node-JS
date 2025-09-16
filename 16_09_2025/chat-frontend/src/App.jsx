import { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws.current) {
      ws.current.send(input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Chat App</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
