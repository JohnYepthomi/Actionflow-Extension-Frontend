import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dependencies } from './package.json';

function renderChunks(deps){
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-dom'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    outDir: "../ActionflowExtension/dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  preview: {
    // set to the same as dev port to test frontend build on Tauri Dev Mode before rust compile
    port: 5173
  }
});
