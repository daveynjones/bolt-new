const express = require("express");
const { createRequestHandler } = require("@remix-run/express");
const compression = require('compression');
const morgan = require('morgan');
const path = require("path");

const app = express();

app.use(compression());
app.use(morgan("tiny"));

// Serve static files from both dist and public directories
app.use(express.static("dist"));
app.use(express.static("public"));

// Add the Remix SSR request handler
app.all(
  "*",
  createRequestHandler({
    getLoadContext() {
      return {};
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Express server listening on port ${port}`);
});
