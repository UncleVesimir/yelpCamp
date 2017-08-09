const router = require('express').Router();
const Campground = require("../models/campground");

router.get("/", function(req, res){
Campground.find({}, function(err, allCampgrounds){
  if(err){
    console.error(err);
  }
  res.render("campgrounds/index", {campgrounds: allCampgrounds});
  });
});

router.get("/new", isLoggedIn, function(req, res){
  res.render('/newGround');
});

router.get("/:id", function (req, res){

  Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCamp) =>{
      res.render("campgrounds/show", {campground: foundCamp});
    })
    .catch((err) => {console.log(err)}) 
});

router.post("/", function(req, res){
  let name = req.body.name;
  let img = req.body.image;
  let description = req.body.description;
  let newCamp = {name: name, image: img, description: description};

 Campground.create(newCamp).then((addedCamp)=>{
   console.log(`Added new Camp Ground:\n ${addedCamp}`)
   res.redirect("/campgrounds");
 }).catch((err)=>console.log(err))
});

function isLoggedIn(req , res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;