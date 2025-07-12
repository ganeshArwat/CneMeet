import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Buffer } from "buffer";
import process from "process";
import { Toaster } from "react-hot-toast";

window.Buffer = Buffer;
window.process = process;

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <Toaster position="top-center" reverseOrder={false} />
    <App />
  </StrictMode>
);
