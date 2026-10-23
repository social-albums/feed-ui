import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Destinos del proxy de dev. Por defecto apuntan a los puertos publicados en la
// máquina (`npm run dev` directo); el contenedor de dev los sobreescribe con los
// nombres de servicio de la red my-ig-network.
const target = (name: string, fallback: string) => process.env[name] ?? fallback;

// Proxy de dev: el browser solo habla con Vite (mismo origen), así funciona
// desde otros dispositivos de la red sin tocar CORS ni hardcodear IPs.
const service = (prefix: string, url: string) => ({
  [prefix]: {
    target: url,
    changeOrigin: true,
    rewrite: (path: string) => path.slice(prefix.length),
  },
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    proxy: {
      ...service('/api/auth', target('AUTH_TARGET', 'http://localhost:8080')),
      ...service('/api/feed', target('FEED_TARGET', 'http://localhost:8081')),
      ...service('/api/content', target('CONTENT_TARGET', 'http://localhost:8082')),
      ...service('/api/social', target('SOCIAL_TARGET', 'http://localhost:8083')),
      // Imágenes de MinIO (S3_BASE_URL=/my-ig-media en el backend)
      '/my-ig-media': {
        target: target('MINIO_TARGET', 'http://localhost:9000'),
        changeOrigin: true,
      },
    },
  },
});
