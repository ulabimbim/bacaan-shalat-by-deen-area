import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bacaan Shalat',
        short_name: 'Bacaan Shalat',
        lang: 'id',
        description: 'Kenali bacaan shalat sesuai urutan bagiannya.',
        display: 'standalone',
        start_url: '/',
        theme_color: '#33473B',
        background_color: '#F6F3EC',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,woff2,png,svg,ico,webmanifest}'],
        globIgnores: ['**/node_modules/**/*', '**/assets/*.js?*'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'],
    }),
  ],
  build: {
    outDir: 'dist',
  },
})
