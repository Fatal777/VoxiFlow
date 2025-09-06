import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts', 'd3'],
          forms: ['react-hook-form', 'react-dropzone'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react(), tsconfigPaths(), tagger()],
  server: {
    host: true,
    port: 3000,
    open: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
  },
});