// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://wic.ihiro.page',
  output: 'static',
  build: { format: 'directory' },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
