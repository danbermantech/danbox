import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
    VitePWA({
      // text:'okay', 
      registerType: 'autoUpdate', 
      injectRegister: 'script',
      manifest: {
        name: "DanBox",
        // registerType: 'autoUpdate',
        short_name: "DanBox",
        start_url: "/",
        background_color: "#3d3d3d",
        theme_color: "#2d2d2d",
        orientation: "any",
        display: "fullscreen",
        lang: "en-us",
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,jsx,css,html,ico,png,svg,mp3,wav}'],
        maximumFileSizeToCacheInBytes: 10000000,
      },
      devOptions: {
        enabled:false,
      },
    })
  ],
  appType: 'spa',
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
