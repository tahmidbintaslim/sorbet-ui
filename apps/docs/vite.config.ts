// @ts-ignore
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@sorbetui/tokens': path.resolve(__dirname, '../../../packages/tokens/src'),
      '@sorbetui/theme': path.resolve(__dirname, '../../../packages/theme/src'),
      '@sorbetui/react': path.resolve(__dirname, '../../../packages/react/src'),
    },
  },
});
