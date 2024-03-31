import { defineConfig } from 'vite'

import solid from 'vite-plugin-solid'
import unocss from "unocss/vite";

import path from "node:path";

export default defineConfig({
  plugins: [
    unocss(),
    solid()
  ],

  server: {
    strictPort: true,
    port: 3000
  },

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  }
});
