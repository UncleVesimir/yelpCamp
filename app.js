const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      seedDB = require("./seeds"),
      passport = require("passport"),
      LocalStrategy = require("passport-local");



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
// 
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req , res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
seedDB();

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

app.listen(process.env.PORT || 8000, function (){
  console.log("Yelp Camp Server running - Listening on port 8000");
});

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', isLoggedIn, commentsRoutes);
app.use('/', indexRoutes);