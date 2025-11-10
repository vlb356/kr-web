import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas que ya tienes en /src/pages
import Marketing from "./pages/Marketing.jsx";
import Explore from "./pages/Explore.jsx";
import Events from "./pages/Events.jsx";
import Social from "./pages/Social.jsx";
import Leagues from "./pages/Leagues.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import Auth from "./pages/Auth.jsx";

// Si tu navbar existe, mantenlo; si no, quita esta línea.
import Nav from "./components/Nav.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {typeof Nav === "function" ? <Nav /> : null}

      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <Routes>
          {/* Home = tu pantalla de marketing */}
          <Route path="/" element={<Marketing />} />

          {/* Rutas de la app */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/events" element={<Events />} />
          <Route path="/social" element={<Social />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/auth" element={<Auth />} />

          {/* Cualquier ruta desconocida redirige al Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
