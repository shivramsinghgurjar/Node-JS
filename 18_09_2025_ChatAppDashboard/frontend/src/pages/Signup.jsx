import React, { useState } from "react";
import InputField from "../components/InputField";
import { signup } from "../utils/api";

export default function Signup({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = await signup(username, email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // redirect to chat
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
        <span className="switch" onClick={onSwitch}>Login</span>
      </p>
    </div>
  );
}
