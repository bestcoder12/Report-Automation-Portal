import session from 'express-session';
import * as dotenv from 'dotenv';

dotenv.config();

const mockSessionMiddleware = () =>
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    name: process.env.COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 3600000,
    },
  });

export default mockSessionMiddleware;
