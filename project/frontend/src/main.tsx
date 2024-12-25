import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import SchedulePageRouter from "./ExampleButton";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SchedulePageRouter />
    <App />
  </StrictMode>
);
