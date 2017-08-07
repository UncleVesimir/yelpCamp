const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      seedDB = require("./seeds"),
      passport = require("passport"),
      LocalStrategy = require("passport-local");




const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true} );
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
// 
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req , res, next){
  if(req.isAutheticated()){
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

app.get("/", function (req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
Campground.find({}, function(err, allCampgrounds){
  if(err){
    console.error(err);
  }
  res.render("campgrounds/index", {campgrounds: allCampgrounds});

});



app.get("/campgrounds/new", isLoggedIn, function(req, res){
  res.render('campgrounds/newGround');
});

app.get("/campgrounds/:id", function (req, res){

  Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCamp) =>{
      res.render("campgrounds/show", {campground: foundCamp});
    })
    .catch((err) => {console.log(err)}) 
});

app.post("/campgrounds", function(req, res){
  let name = req.body.name;
  let img = req.body.image;
  let description = req.body.description;
  let newCamp = {name: name, image: img, description: description};

 Campground.create(newCamp).then((addedCamp)=>{
   console.log(`Added new Camp Ground:\n ${addedCamp}`)
   res.redirect("/campgrounds");
 }).catch((err)=>console.log(err))
});

// =========================
// COMMENT ROUTES
// =========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }
    else{
      res.render("comments/new", {campground: campground});
    }
  })
  
});

app.post("/campgrounds/:id/comments/", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds")
    }
    else{
      Comment.create(req.body.comment)
        .then((comment)=>{
          campground.comments.unshift(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`)
        })
        .catch((err)=>{
          console.log(err);
          res.redirect("/campgrounds")
        });
        
    }
  })
  
});


// AUTH ROUTES

app.get("/register", function(req, res){
  res.render('register');
});

app.post("/register", function(req, res){
  let newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err)
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    })
  })
})

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate('local', {
  successRedirect: "/campgrounds", failureRedirect: "/login"}));

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})