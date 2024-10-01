import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import PrismaSessionStore from './src/handlers/session';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const sessionStore = new PrismaSessionStore(prisma);

app.use(session({
  secret: process.env.PASSPORT_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (_, res) => {
    res.redirect('/');
  });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
