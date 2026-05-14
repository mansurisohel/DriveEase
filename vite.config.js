import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * manualChunks as a FUNCTION — required when you want fine-grained
 * control over chunk splitting. The object form silently disables
 * splitVendorChunkPlugin and emits a warning; the function form is the
 * correct approach per Rollup / Vite docs.
 *
 * How it works:
 *   id  — the fully-resolved module path Rollup is about to bundle.
 *   Return a chunk name (string) to assign it, or undefined to let
 *   Rollup decide (it will apply its default splitting behaviour).
 */
function manualChunks(id) {
  // React core
  if (id.includes('node_modules/react/') ||
      id.includes('node_modules/react-dom/') ||
      id.includes('node_modules/react-router-dom/') ||
      id.includes('node_modules/scheduler/')) {
    return 'react-vendor';
  }

  // Small UI utilities
  if (id.includes('node_modules/react-hot-toast/') ||
      id.includes('node_modules/react-hook-form/')) {
    return 'ui-vendor';
  }

  // FontAwesome — split to keep chunks lean
  if (id.includes('@fortawesome/free-solid-svg-icons')) return 'fa-solid';
  if (id.includes('@fortawesome/free-brands-svg-icons') ||
      id.includes('@fortawesome/free-regular-svg-icons')) return 'fa-brands';
  if (id.includes('@fortawesome/fontawesome-svg-core') ||
      id.includes('@fortawesome/react-fontawesome'))    return 'fa-core';

  // Owner-only pages (lazy-loadable group)
  if (id.includes('src/pages/owner/')) return 'owner-pages';
}

export default defineConfig({
  base: '/driveease/',   // ← your repo name
  plugins: [react()],          // splitVendorChunkPlugin removed — function form handles it
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: { manualChunks },
    },
  },
});