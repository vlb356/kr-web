// src/features/auth/Auth.jsx
import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setMsg("Logged in successfully.");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMsg("Account created successfully.");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setMsg("Logged out.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="kr-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "login" ? "Login" : "Create account"}
        </h2>

        {msg && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 text-sm">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="email"
            placeholder="Email"
            className="kr-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="kr-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="kr-btn-primary"
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button
            onClick={() => setMode("login")}
            className={mode === "login" ? "text-blue-600 font-semibold" : "text-gray-500"}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={mode === "register" ? "text-blue-600 font-semibold" : "text-gray-500"}
          >
            Register
          </button>
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button onClick={handleLogout} className="text-red-600 text-sm underline">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
