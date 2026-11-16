import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Build for opening index.html straight from disk. Paths are relative and the
// bundle is one classic script, because browsers refuse ES modules over file://.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'classic-script',
      // `defer` matters: a classic script in <head> would otherwise run before #root exists.
      transformIndexHtml: (html: string) => html.replace('<script type="module"', '<script defer').replace(/ crossorigin/g, ''),
    },
  ],
  build: {
    outDir: 'offline',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    target: 'es2020',
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } },
  },
})
