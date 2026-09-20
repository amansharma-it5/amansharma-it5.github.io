import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://amansharma-it5.github.io',
  output: 'static',
  integrations: [react()],
  build: {
    format: 'directory'
  },
  vite: {
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei']
    }
  }
});
