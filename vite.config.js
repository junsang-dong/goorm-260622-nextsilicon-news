import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Dev: /api/news → newsapi.org (server-side, apiKey injected here)
        '/api/news': {
          target: 'https://newsapi.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/news/, '/v2/everything'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const sep = proxyReq.path.includes('?') ? '&' : '?'
              proxyReq.path += `${sep}apiKey=${env.VITE_NEWS_API_KEY}`
            })
          },
        },
        '/proxy/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/anthropic/, ''),
        },
        '/proxy/openai': {
          target: 'https://api.openai.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/openai/, ''),
        },
        '/proxy/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/gemini/, ''),
        },
      },
    },
  }
})
