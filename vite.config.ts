import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), cloudflare()],
    base: env.VITE_BASE_URL,
    server: {
      proxy: {
        "/ga": {
          target: env.VITE_GREENARROW_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              const token = env.VITE_GREENARROW_BEARER_TOKEN
              proxyReq.setHeader("Authorization", `Bearer ${token}`)
              proxyReq.setHeader("Accept", "application/json")
              proxyReq.setHeader("Content-Type", "application/json")
            })
          },
        },
      },
    },
  };
})