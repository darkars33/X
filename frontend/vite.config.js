import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 5000,
    proxy:{
      "/api":{
        target: "https://x-mi5s.onrender.com",//change in url
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
