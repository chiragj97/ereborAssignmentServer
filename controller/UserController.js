const router = require('express').Router();
const User = require('../models/User');
const sendEmail = require('../mailer');

router.get('/activate/:id', (req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      data.allowAccess = true;
      data.save();
    }
    res.redirect(`${process.env.CLIENT_DOMAIN}/login`);
  });
});

router.post('/register', function (req, res) {
  let body = req.body;
  const user = new User(body);
  user
    .save()
    .then(function (user) {
      res.send(
        'Registration Successfull. Please click on the confirmation link sent on your registered email'
      );
      sendEmail(user);
    })
    .catch(function (err) {
      res.status(400).json('Error:' + err);
    });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    console.log('L', user);
    if (!user) {
      res.send('User does not exist');
    } else {
      console.log('E', user);
      if (user.allowAccess === true) {
        if (user.password === req.body.password) {
          res.json({
            user: user,
            message: 'User Authenticated Successfully',
          });
        } else {
          res.send('Invalid Email or Password');
        }
      } else {
        res.send(
          'Please verify you account by clicking the link sent to you on your registered email'
        );
      }
    }
  });
});

router.get('/get', (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => err.status(400).json(err));
});

module.exports = router;
