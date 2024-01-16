import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      { find:'$', replacement: resolve(__dirname, './src')},
      { find:'$components', replacement: resolve(__dirname, './src/components')},
      { find:'$assets', replacement: resolve(__dirname, './src/assets')},
      { find:'$store', replacement: resolve(__dirname, './src/store')},
      { find:'$hooks', replacement: resolve(__dirname, './src/hooks')},
      { find:'$contexts', replacement: resolve(__dirname, './src/contexts')},
      { find:'$utils', replacement: resolve(__dirname, './src/utils')},
      { find:'$constants', replacement: resolve(__dirname, './src/constants')},
    
    ]
  }
});
