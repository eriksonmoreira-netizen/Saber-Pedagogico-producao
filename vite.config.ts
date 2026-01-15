
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    // Em produção, aponta para a pasta do plugin no WordPress.
    // Em dev, usa a raiz.
    base: isProduction ? '/wp-content/plugins/saber-integration/app/' : '/', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID || ""),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Garante nomes de arquivos previsíveis para facilitar o debug, se necessário
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  };
});
