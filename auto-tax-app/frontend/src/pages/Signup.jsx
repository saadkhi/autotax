import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/signup/", form);
      nav("/login");
    } catch (err) {
      setError(err?.response?.data ? JSON.stringify(err.response.data) : "Signup failed");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign up</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input placeholder="Username" value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Create account</button>
        {error && <pre>{error}</pre>}
      </form>
    </div>
  );
}
