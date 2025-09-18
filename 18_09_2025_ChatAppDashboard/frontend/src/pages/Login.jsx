import React, { useState } from "react";
import InputField from "../components/InputField";
import { login } from "../utils/api";

export default function Login({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await login(username, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // redirect to chat
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
        Don't have an account?{" "}
        <span className="switch" onClick={onSwitch}>Sign Up</span>
      </p>
    </div>
  );
}
