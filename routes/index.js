const router = require('express').Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", function (req, res){
  res.render("landing");
});

router.get("/register", function(req, res){
  res.render('register');
});

router.post("/register", function(req, res){
  let newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err)
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      req.flash('success', "Welcome to YelpCamp, " + user.username);
      res.redirect("/campgrounds");
    })
  })
})

router.get("/login", function(req, res){
  res.render("login");
});

router.post("/login", passport.authenticate('local', {
  successRedirect: "/campgrounds", failureRedirect: "/login"}));

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You have been successfully logged out.")
  res.redirect("/");
});

module.exports = router;