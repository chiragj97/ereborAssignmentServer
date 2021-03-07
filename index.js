const express = require('express');
const passport = require('passport');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
let user = {};

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully !');
});

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
    },
    (accessToken, tokenSecret, profile, cb) => {
      console.log('Token: ', accessToken);
      console.log('TokenSecret: ', tokenSecret);
      console.log('Profile: ', profile);
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/auth/facebook/redirect',
    },
    (accessToken, tokenSecret, profile, cb) => {
      console.log('Token: ', accessToken);
      console.log('TokenSecret: ', tokenSecret);
      console.log('Profile: ', profile);
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google/login',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/redirect',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
  }),
  function (req, res) {
    console.log(req);
    res.redirect('http://localhost:3000/profile');
  }
);

app.get('/auth/facebook/login', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/redirect',
  passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/login',
  }),
  function (req, res) {
    res.redirect('http://localhost:3000/profile');
  }
);

app.get('/user', (req, res) => {
  res.send(user);
});

const usersRouter = require('./controller/UserController');
app.use('/user', usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App started running on port: ${PORT}`);
});
