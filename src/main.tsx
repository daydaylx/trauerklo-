import "./index.css";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChatRoute } from "./routes/ChatRoute";
import { EditorRoute } from "./routes/EditorRoute";
import { SettingsRoute } from "./routes/SettingsRoute";

const router = createBrowserRouter([
  { path: "/", element: <ChatRoute /> },
  { path: "/editor", element: <EditorRoute /> },
  { path: "/settings", element: <SettingsRoute /> },
]);

function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRegister />
    <RouterProvider router={router} />
  </StrictMode>
);
