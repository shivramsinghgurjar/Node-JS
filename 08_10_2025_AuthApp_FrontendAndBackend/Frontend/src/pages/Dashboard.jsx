import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>
        Welcome, <strong>{user?.name}</strong>
      </p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <div style={{ marginTop: 16 }}>
        <button onClick={logoutUser}>Logout</button>
      </div>
    </div>
  );
}
