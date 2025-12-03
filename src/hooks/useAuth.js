import { useEffect, useState } from "react";
import {
  auth,
  onAuthChanged,
  ensureUserDoc,
  getUserProfile,
  loginEmailPassword,
  registerEmailPassword,
  logout as fbLogout,
  setSubscriptionPlan,
} from "../lib/firebase";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [sub, setSub] = useState({ active: false, plan: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChanged(async (u) => {
      setUser(u || null);
      if (u) {
        await ensureUserDoc(u.uid);
        const profile = await getUserProfile(u.uid);
        setSub(profile?.subscription || { active: false });
      } else {
        setSub({ active: false });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function login(email, password) {
    const u = await loginEmailPassword(email, password);
    setUser(u);
  }
  async function register(name, email, password) {
    const u = await registerEmailPassword(name, email, password);
    setUser(u);
  }
  async function pay(plan) {
    if (!auth.currentUser) { alert("Please sign in first"); return; }
    const chosen = plan || "one-pass";
    await setSubscriptionPlan(auth.currentUser.uid, chosen);
    setSub({ active: true, plan: chosen });
    alert(`Plan changed to: ${chosen}`);
    window.location.hash = "/events";
  }
  async function logout() {
    await fbLogout();
    window.location.hash = "/auth"; // opcional, pero recomendado
  }

  return { user, sub, loading, login, register, pay, logout };
}