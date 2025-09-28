import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Treat .js files as JSX
    include: /src\/.*\.[jt]sx?$/, // Apply to all .js, .jsx, .ts, .tsx in src/
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Ensure pre-bundling also handles JSX in .js
      },
    },
  },
});