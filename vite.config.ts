import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@emailjs")) {
            return "emailjs";
          }

          if (
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/three")
          ) {
            return "three-vendor";
          }

          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/tests/setup.ts"],
    exclude: ["tests/**", "node_modules/**", "dist/**"],
  },
});
