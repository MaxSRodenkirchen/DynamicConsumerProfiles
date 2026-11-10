import { defineConfig } from 'vite';
import express from 'express';
import { apiRouter } from './server/apiRouter.js';

export default defineConfig({
  plugins: [
    {
      name: 'api-server-middleware',
      configureServer(server) {
        const app = express();
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ limit: '50mb', extended: true }));
        app.use('/api', apiRouter);
        app.use((err, req, res, next) => {
          console.error('[API Error in Vite Middleware]', err);
          if (!res.headersSent) {
            res.status(err.status || 500).json({ error: err.message || 'Serverfehler' });
          }
        });
        server.middlewares.use(app);
      }
    }
  ]
});
