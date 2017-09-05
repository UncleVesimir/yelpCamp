const router = require('express').Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", function (req, res){
  res.render("landing");
});

router.get("/register", function(req, res){
  res.render('register', {page: 'register'});
});

router.post("/register", function(req, res){
  let userPass = req.body.user.password;
  let userRegistrationInfo = req.body.user;
  delete userRegistrationInfo.password;

  let newUser = new User(userRegistrationInfo);

  if(req.body.adminCode === "secretAdminCode123"){
    newUser.isAdmin = true;
  }
  User.register(newUser, userPass, function(err, user){
    if(err){
      req.flash('error', err.message);
      return res.render('register',{errorMessage: err.message});
    }
    passport.authenticate("local")(req, res, function(){
      req.flash('success', "Welcome to YelpCamp, " + user.username);
      res.redirect("/campgrounds");
    })
  })
})

router.get("/login", function(req, res){
  res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate('local', {
  failureRedirect: "/login", failureFlash: true}),
  function(req, res){
    req.flash('login', `Welcome back, ${req.user.username}!`);
    res.redirect('/campgrounds');
  }
);

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You have been successfully logged out.")
  res.redirect("/");
});

module.exports = router; 