import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";
import { supabase } from "./lib/supabase";
import { listen } from "@tauri-apps/api/event";

/**
 Handle OAuth deep link callback (Google → Supabase → Tauri)
 */
listen("deep-link://new-url", async (event) => {
  const urlString = event.payload;

  if (typeof urlString === "string" && urlString.includes("access_token")) {
    // 1. Create a URL object from the string
    const url = new URL(urlString.replace("#", "?")); // Supabase returns fragments as #
    
    // 2. Extract tokens from the hash/query
    const params = new URLSearchParams(url.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      
      if (error) console.error("Error setting session:", error.message);
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster richColors position="top-right" />
  </>
);
