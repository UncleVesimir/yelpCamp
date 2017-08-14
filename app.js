const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      seedDB = require("./seeds"),
      passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      methodOverride = require("method-override");



//Models
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
//Routes

const campgroundsRoutes = require('./routes/campgrounds');
const commentsRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true} );
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// seedDB();

// Passport config

app.use(require("express-session")({
  secret: "hootoonanana",
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set-up local for rendered views//
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.isCampOwner = null;
  next();
});
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', isLoggedIn, commentsRoutes);
app.use('/', indexRoutes);

function isLoggedIn(req , res, next){
  console.log(req.url);
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(process.env.PORT || 8000, function (){
  console.log("Yelp Camp Server running - Listening on port 8000");
});



