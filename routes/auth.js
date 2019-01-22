const express = require('express');
const passport = require('passport');
let User = require('../models/user');
let router = express.Router();

router.get('/', (req,res) => {
  res.render("landing");
});

router.get('/register', (req,res) => {
  res.render('register');
});

router.post('/register', (req,res) => {
  let newUser = new User({username:req.body.username});
  User.register(newUser, req.body.password, (err, user) =>{
    if(err){
      res.redirect('register');
    }
    passport.authenticate('local')(req,res, () => {
      res.redirect('/campgrounds');
    });
  });
});

router.get('/login', (req,res) => {
  res.render('login');
});
router.post('/login', passport.authenticate('local',
{
  successRedirect: "/campgrounds",
  failureRedirect: '/login'
}), (req,res) => {req.flash('success', 'Welcome back!')});
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;
