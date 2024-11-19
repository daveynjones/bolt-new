const { createRequestHandler } = require('@remix-run/express');
const { installGlobals } = require('@remix-run/node');
const express = require('express');
const { createServer: createViteServer } = require('vite');
const compression = require('compression');
const morgan = require('morgan');

installGlobals();

const app = express();

async function createServer() {
  let vite = null;

  try {
    if (process.env.NODE_ENV === 'development') {
      vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
      });
    }

    // middleware
    app.use(compression());
    app.use(morgan('tiny'));

    // handle static files
    app.use(express.static('dist'));
    app.use(express.static('public'));

    // handle remix requests
    app.all(
      '*',
      createRequestHandler({
        build: async () => {
          try {
            if (!vite) {
              const build = require('../build/server/index.js');
              return build.default;
            }

            const build = await vite.ssrLoadModule('virtual:remix/server-build');

            return build.default;
          } catch (error) {
            console.error('Error loading build:', error);
            throw error;
          }
        },
        getLoadContext() {
          return {};
        },
      }),
    );

    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => {
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
