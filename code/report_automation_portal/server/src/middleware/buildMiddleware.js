import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const buildMiddleware = (app) => {
  // eslint-disable-next-line no-underscore-dangle
  const __filename = fileURLToPath(import.meta.url);
  // eslint-disable-next-line no-underscore-dangle
  const __dirname = path.dirname(__filename);
  const root = path.join(__dirname, '../../../client/build');
  app.use(express.static(root));

  app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/build', 'index.html'));
  });

  return app;
};

export default buildMiddleware;
