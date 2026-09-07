import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ppc-home-dev/1/' : '/',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
});
