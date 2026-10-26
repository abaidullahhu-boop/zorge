import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// Build-only: re-encode imported images as WebP with the long side capped at
// 2560px. Sources in src/assets are untouched; results are cached in
// node_modules/.cache/imagetools.
const optimizeImages = {
  ...imagetools({
    include: /^[^?]+\.(jpe?g|png|webp)(\?.*)?$/i,
    defaultDirectives: new URLSearchParams({
      format: 'webp',
      w: '2560',
      h: '2560',
      fit: 'inside',
    }),
  }),
  apply: 'build',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), optimizeImages],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/lenis')) return 'lenis'
          if (id.includes('node_modules/react-dom')) return 'react-dom'
          if (id.includes('node_modules/react/')) return 'react'
          return undefined
        },
      },
    },
  },
})
