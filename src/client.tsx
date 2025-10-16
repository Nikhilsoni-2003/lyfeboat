import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { setupClient } from "./services/axios/client";

setupClient();

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>
);
