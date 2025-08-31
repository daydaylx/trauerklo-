import "./index.css";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChatRoute } from "./routes/ChatRoute";
import { Editor } from "./features/customize/Editor";
import { SettingsRoute } from "./routes/SettingsRoute";

const router = createBrowserRouter([
  { path: "/", element: <ChatRoute /> },
  { path: "/editor", element: <Editor /> },
  { path: "/settings", element: <SettingsRoute /> },
]);

function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // wichtig: BASE_URL für GitHub Pages Subpfad
      const swUrl = import.meta.env.BASE_URL + "sw.js";
      navigator.serviceWorker.register(swUrl).catch(() => {});
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
