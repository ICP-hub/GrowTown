import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/useAuthClient";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
 <BrowserRouter future={{
      v7_startTransition: true, 
      v7_relativeSplatPath:true
    }}>
            <App />
      </BrowserRouter>
  </React.StrictMode>
);
