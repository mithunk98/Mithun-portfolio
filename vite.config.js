import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        cs1: resolve(__dirname, 'case-study-1.html'),
        cs2: resolve(__dirname, 'case-study-2.html'),
        cs3: resolve(__dirname, 'case-study-3.html'),
        cs4: resolve(__dirname, 'case-study-4.html'),
        cs5: resolve(__dirname, 'case-study-5.html'),
        cs6: resolve(__dirname, 'case-study-6.html'),
      },
    },
  },
})
