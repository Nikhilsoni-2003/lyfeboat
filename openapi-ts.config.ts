import { defineConfig } from "@hey-api/openapi-ts";
import { SCHEMA_API_BASE_URL } from "./src/services/api/base";

export default defineConfig({
  input: `${SCHEMA_API_BASE_URL}/schema/`,
  output: "src/services/api/gen",
  plugins: [
    // {
    //   name: "@hey-api/client-axios",
    //   runtimeConfigPath: "./src/services/axios/client.ts",
    // },
    "@hey-api/client-axios",
    "@tanstack/react-query",
    // "@hey-api/client-fetch",
  ],
});
