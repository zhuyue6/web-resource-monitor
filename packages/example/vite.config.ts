import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@web-resource-monitor\/(.*)/, replacement: '@web-resource-monitor/$1/src/index.ts' },
    ]
  },
  server: {
    host: true,
    port: 8080,
    cors: true,
  }
})
