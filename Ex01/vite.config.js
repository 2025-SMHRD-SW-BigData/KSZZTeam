import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      // '/api'로 시작하는 요청은 전부 'http://localhost:3001'로 보내라는 규칙
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true, // CORS 오류를 방지하기 위해 출처(Origin)를 변경
      }
    }
  }
})
