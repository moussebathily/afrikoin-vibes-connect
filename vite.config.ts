import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: false,
    cors: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: mode === 'production' ? 'esbuild' : false,
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-toast', '@radix-ui/react-dialog'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'esnext',
    legalComments: 'none',
  },
  css: {
    devSourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
    exclude: ['@capacitor/core', '@capacitor/android', '@capacitor/ios'],
  },
}));
