import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'lib': resolve(__dirname, './lib'),
      'components': resolve(__dirname, './components'),
      'styles': resolve(__dirname, './styles')
    }
  }
})
