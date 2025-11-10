import React from "react";
import Marketing from "./pages/Marketing.jsx";
import Explore from "./pages/Explore.jsx";
import Events from "./pages/Events.jsx";
import Social from "./pages/Social.jsx";
import Leagues from "./pages/Leagues.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import Auth from "./pages/Auth.jsx";
import ForumDetail from "./pages/ForumDetail.jsx";
import Nav from "./components/Nav.jsx"; // si no existe, elimina esta línea y el <Nav />

function useHashPath() {
  const get = () =>
    (window.location.hash ? window.location.hash.slice(1) : "/") || "/";
  const [path, setPath] = React.useState(get());
  React.useEffect(() => {
    const onChange = () => setPath(get());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}

export default function App() {
  const path = useHashPath();
  const clean = (p) => (p || "/").split("?")[0];

  // 1) Ruta dinámica PRIORITARIA
  const forumMatch = clean(path).match(/^\/forum\/([^/?#]+)/);
  if (forumMatch) {
    const id = decodeURIComponent(forumMatch[1]);
    return (
      <>
        <Nav />
        <ForumDetail forumId={id} />
      </>
    );
  }

  // 2) Rutas estáticas
  const route = clean(path);
  let Page = Marketing;
  switch (route) {
    case "/":
    case "/home":
    case "/marketing":
      Page = Marketing; break;
    case "/explore":
      Page = Explore; break;
    case "/events":
      Page = Events; break;
    case "/social":
      Page = Social; break;
    case "/leagues":
      Page = Leagues; break;
    case "/subscribe":
      Page = Subscribe; break;
    case "/auth":
      Page = Auth; break;
    default:
      Page = Marketing; break; // fallback
  }

  return (
    <>
      <Nav />
      <Page />
    </>
  );
}
