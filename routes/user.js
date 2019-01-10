const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');

/* SIGNUP ROUTE */
router
  .route('/signup')
  .get((req, res, next) => {
    res.render('accounts/signup', {
      message: req.flash('errors')
    });
  })
  .post((req, res, next) => {
    User
      .findOne({
        email: req.body.email
      }, function (err, existingUser) {
        if (existingUser) {
          req.flash('errors', 'Account with that email address already exists.');
          return res.redirect('/signup');
        } else {
          var user = new User();
          user.name = req.body.username;
          user.email = req.body.email;
          user.photo = user.gravatar();
          user.password = req.body.password;
          user.save(function (err) {
            if (err) 
              return next(err);
            req
              .logIn(user, function (err) {
                if (err) 
                  return next(err);
                res.redirect('/');
              });
          });
        }
      });
  });

/* LOGIN ROUTE */
router
  .route('/login')
  .get((req, res, next) => {
    if (req.user) 
      return res.redirect('/');
    res.render('accounts/login', {
      message: req.flash('loginMessage')
    });
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

/* PROFILE ROUTE */
router.get('/profile', passportConfig.isAuthenticated, (req, res, next) => {
  res.render('accounts/profile');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
