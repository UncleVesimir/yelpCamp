const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      seedDB = require("./seeds");




const Campground = require("./models/campground");
const Comment = require("./models/comment")


mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true} );
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
seedDB();




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
})

});



app.get("/campgrounds/new", function(req, res){
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

app.get("/campgrounds/:id/comments/new", function(req,res){
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