import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Default Vite strategy is usually sufficient for SPAs
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify for production
    minify: 'esbuild',
    // Target modern browsers for better optimization
    target: 'es2020',
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@google/generative-ai',
    ],
  },
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Use forks pool for better isolation and stability on Windows
    pool: 'forks',
    forks: {
      singleFork: false,
    },
    testTimeout: 60000,
    hookTimeout: 60000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
      ],
    },
  },
})
