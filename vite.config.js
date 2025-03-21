import { resolve } from "path"
import { defineConfig, splitVendorChunkPlugin } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "online-validator": resolve(__dirname, "online-validator", "index.html"),
        "filename-wizard": resolve(__dirname, "filename-wizard", "index.html"),
        "txt-generator": resolve(__dirname, "txt-generator", "index.html"),
      },
    },
  },
  test: {
    environment: 'jsdom',
    // globals: true,
    root: './tests'
  }
})
