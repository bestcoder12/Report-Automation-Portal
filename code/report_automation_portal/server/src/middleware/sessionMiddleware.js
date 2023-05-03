import session from 'express-session';
import { sessionStore } from './database.js';

const sessionMiddleware = (app) => {
  app.use(
    session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      name: process.env.COOKIE_NAME,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 3600000,
      },
    })
  );

  return app;
};

export default sessionMiddleware;
