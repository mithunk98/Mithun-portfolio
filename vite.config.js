import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // admin.html is intentionally NOT built or deployed. It is gated only by
        // a passcode compared in client-side JavaScript, which anyone can read
        // from the page source - that is not a security boundary, so the page
        // must not be published. Run it locally with `npm run dev` instead.
        cs1: resolve(__dirname, 'case-study-1.html'),
        cs2: resolve(__dirname, 'case-study-2.html'),
        cs3: resolve(__dirname, 'case-study-3.html'),
        cs4: resolve(__dirname, 'case-study-4.html'),
        cs5: resolve(__dirname, 'case-study-5.html'),
        cs6: resolve(__dirname, 'case-study-6.html'),
        cs7: resolve(__dirname, 'case-study-7.html'),
        cs8: resolve(__dirname, 'case-study-8.html'),
      },
    },
  },
})
