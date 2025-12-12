import React, { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      window.location.hash = "#/profile/" + auth.currentUser.uid;
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = res.user.uid;

      await setDoc(doc(db, "users", uid), {
        name,
        email,
        bio: "",
        createdAt: new Date(),
      });

      window.location.hash = "#/profile/" + uid;
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl p-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-[#122944] mb-8">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h1>

        {/* SWITCH TABS */}
        <div className="flex justify-center gap-10 mb-8">
          <button
            onClick={() => setMode("login")}
            className={`text-lg font-semibold pb-1 transition ${mode === "login"
              ? "text-[#1662A6] border-b-2 border-[#1662A6]"
              : "text-gray-400 hover:text-[#122944]"
              }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`text-lg font-semibold pb-1 transition ${mode === "register"
              ? "text-[#1662A6] border-b-2 border-[#1662A6]"
              : "text-gray-400 hover:text-[#122944]"
              }`}
          >
            Register
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          className="space-y-6"
          onSubmit={mode === "login" ? handleLogin : handleRegister}
        >
          {/* USERNAME only in register */}
          {mode === "register" && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1662A6] focus:outline-none"
                placeholder="Your username"
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1662A6] focus:outline-none"
              placeholder="you@email.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1662A6] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-[#1662A6] text-white font-semibold rounded-xl 
                     hover:bg-[#0e4d7d] transition shadow-sm"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
