import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthProvider.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import { VITE_GOOGLE_CLIENT_ID } from "./apis/index.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
);
