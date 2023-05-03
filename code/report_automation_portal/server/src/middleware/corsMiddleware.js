import cors from 'cors';

const corsMiddleware = (app) => {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: 'GET,PUT,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    })
  );

  return app;
};

export default corsMiddleware;
