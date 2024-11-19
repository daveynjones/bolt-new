import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import express from 'express';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import type { ServerBuild } from '@remix-run/node';

installGlobals();

const app = express();

async function createServer() {
  let vite: ViteDevServer | null = null;

  try {
    if (process.env.NODE_ENV === 'development') {
      vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
      });
    }

    // handle public assets
    app.use(express.static('public'));

    // handle remix requests
    app.all(
      '*',
      createRequestHandler({
        build: async () => {
          try {
            if (!vite) {
              // use dynamic import with explicit file path
              const build = await import('../build/server/index.js');
              return build.default as ServerBuild;
            }

            const build = await vite.ssrLoadModule('virtual:remix/server-build');

            return build.default as ServerBuild;
          } catch (error) {
            console.error('Error loading build:', error);
            throw error;
          }
        },
      }),
    );

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to create server:', error);
    throw error;
  }
}

createServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
