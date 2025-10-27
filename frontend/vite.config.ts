import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Use esbuild’s native JSX transform from TypeScript (react-jsx) without Babel plugin
  server: {
    port: 3001,
    host: true
  }
})