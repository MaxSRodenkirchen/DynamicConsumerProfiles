import { defineConfig } from 'vite';
import express from 'express';
import { apiRouter } from './server/apiRouter.js';

export default defineConfig({
  plugins: [
    {
      name: 'api-server-middleware',
      configureServer(server) {
        const app = express();
        app.use(express.json({ limit: '10mb' }));
        app.use('/api', apiRouter);
        server.middlewares.use(app);
      }
    }
  ]
});
