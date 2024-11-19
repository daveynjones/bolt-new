/// <reference types="vite/client" />

// CSS/SCSS modules
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// CSS URL imports
declare module '*?url' {
  const content: string;
  export default content;
}

// server build
declare module '../dist/server/index.js' {
  import type { ServerBuild } from '@remix-run/node';
  const build: ServerBuild;
  export default build;
}

// remove Cloudflare/Wrangler types
declare module '@remix-run/node' {
  export interface AppLoadContext {
    // add any custom context properties here
  }
}

// delete load-context.ts as it's Cloudflare specific
