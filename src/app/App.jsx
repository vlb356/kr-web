// src/app/App.jsx
import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";

import Layout from "@/app/Layout";
import AppRouter from "@/app/router";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [sub, setSub] = useState({ active: false });

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <HashRouter>
      <Layout>
        <AppRouter user={user} sub={sub} />
      </Layout>
    </HashRouter>
  );
}
