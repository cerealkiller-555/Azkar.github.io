import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Updated base to match the user's provided GitHub Pages URL
  base: '/Azkar.github.io/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
