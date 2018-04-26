'use strict';
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('4bc08b3de3a54b23893c97e4ff7e3b26');

module.exports = function( _, passport, crypto, nodemailer, Users, async ) {
  return {
      SetRouting: function(router){
        router.get('/', this.indexPage );
        router.get('/signup', this.getSignUp);
        router.get('/auth/facebook', this.getFacebookLogin);
        router.get('/auth/facebook/callback', this.facebookLogin);
        router.get('/auth/google', this.getGoogleLogin);
        router.get('/auth/google/callback', this.googleLogin);
        router.get('/reset/:token', this.reset);
        router.get('/forgot', this.forgotPass);

        router.post('/reset/:token', this.postReset);
        router.post('/forgot', this.postForgotPass);
        router.post('/', this.postLogin);
        router.post('/signup' , this.postSignUp);
      },

      indexPage: function(req, res){
        newsapi.v2.topHeadlines({
          category: 'technology',
          language: 'en',
          country: 'us',
          pageSize: 3
        }).then(response => {
          return res.render('index', {title: 'DinBing - Profile', user:req.user, news: response});
        });

      },

      postLogin: passport.authenticate('local.login', {
          successRedirect: '/home',
          failureRedirect: '/',
          failureFlash: true
      }),

      getSignUp: function( req, res ) {
        return res.render('signup');
      },

      forgotPass: function(req, res){
        res.render('forgot');
      },

      postForgotPass: function(req, res, next){
          async.waterfall([
              function(done) {
                crypto.randomBytes(20, function(err, buf) {
                  var token = buf.toString('hex');
                  done(err, token);
                });
              },
              function(token, done) {
                Users.findOne({ email: req.body.email }, function(err, user) {
                  if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                  }

                  console.log(user);

                  user.resetPasswordToken = token;
                  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                  user.save(function(err) {
                    done(err, token, user);
                  });
                });
              },
              function(token, user, done) {
                var smtpTransport = nodemailer.createTransport({
                  service: 'Gmail',
                  auth: {
                    user: 'arghyajyoti1@gmail.com',
                    pass: 'Bmd@9832'
                  }
                });
                var mailOptions = {
                  from: 'arghyajyoti1@gmail.com',
                  to: req.body.email,
                  subject: 'Password Reset',
                  text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                // smtpTransport.sendMail(mailOptions, function(error, info){
                //   if (error) {
                //     console.log(error);
                //   } else {
                //     console.log('Email sent: ' + info.response);
                //   }
                // });
                smtpTransport.sendMail(mailOptions, function(err) {
                  console.log('mail sent');
                  req.flash('success', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
                  done(err, 'done');
                });
              }
            ], function(err) {
              if (err) {
                return next(err)
              };
              res.redirect('/forgot');
        });
      },

      reset: function(req, res){
        Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
          }
          res.render('reset', {token: req.params.token});
        });
      },

      postReset: function(req, res){
        async.waterfall([
          function(done) {
            Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
              }
              if(req.body.password === req.body.confirm) {

                user.password = user.encryptPassword(req.body.password);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save((err) => {
                    req.logIn(user, function(err) {
                      done(err, user);
                    });
                });
                // user.setPassword(req.body.password, function(err) {
                //   user.resetPasswordToken = undefined;
                //   user.resetPasswordExpires = undefined;
                //
                //   user.save(function(err) {
                //     req.logIn(user, function(err) {
                //       done(err, user);
                //     });
                //   });
                // })
              } else {
                  req.flash("error", "Passwords do not match.");
                  return res.redirect('back');
              }
            });
          },
          function(user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'arghyajyoti1@gmail.com',
                pass: 'Bmd@9832'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'arghyajyoti1@mail.com',
              subject: 'Your password has been changed',
              text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              req.flash('success', 'Success! Your password has been changed.');
              done(err);
            });
          }
        ], function(err) {
          res.redirect('/');
        });
      },

      postSignUp: passport.authenticate('local.signup', {
          successRedirect: '/home',
          failureRedirect: '/signup',
          failureFlash: true
      }),

      getFacebookLogin: passport.authenticate('facebook', {
         scope: 'email'
      }),

      getGoogleLogin: passport.authenticate('google', {
          scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
      }),

      googleLogin: passport.authenticate('google', {
          successRedirect: '/home',
          failureRedirect: '/signup',
          failureFlash: true
      }),

      facebookLogin: passport.authenticate('facebook', {
          successRedirect: '/home',
          failureRedirect: '/signup',
          failureFlash: true
      })
  }
}
