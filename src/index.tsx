import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import { AuthProvider } from "./services/auth/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
