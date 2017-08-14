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



//CREATE Campground

router.get("/new", isLoggedIn, function(req, res){
  res.render('campgrounds/newGround');
});

router.post("/", isLoggedIn, function(req, res){
  let newCamp = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      author:{
        id: req.user._id,
        username:req.user.username
      }
    };


 Campground.create(newCamp).then((addedCamp)=>{
   console.log(`Added new Camp Ground:\n ${addedCamp}`)
   res.redirect("/campgrounds");
 }).catch((err)=>console.log(err))
});

router.get("/:id", checkIfCampAuthorLax, function(req, res){

  Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCamp) =>{
      res.render("campgrounds/show", {campground: foundCamp});
    })
    .catch((err) => {console.log(err)}); 
});


//UPDATE Campground
router.get("/:id/edit", isLoggedIn, checkIfCampAuthorStrict, function(req, res){
  Campground.findById(req.params.id)
    .then((campground)=>{
       res.render("campgrounds/edit", {campground:campground});
    });
});

router.post("/:id", isLoggedIn, checkIfCampAuthorStrict, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
    if(err){
      console.log(err);
      res.redirect("/camgrounds");
    }
    else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

//DELETE
router.delete("/:id", isLoggedIn, checkIfCampAuthorStrict, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }
    res.redirect("/campgrounds");
  })
});

//Auth Middleware.
function isLoggedIn(req , res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkIfCampAuthorStrict(req, res, next){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      return res.redirect("back");
    }
    if(campground.author.id.equals(req.user._id)){
      
      res.locals.isCampOwner = true;
      next();
    }
    else{
      return res.redirect("back");
    }
  });
};
function checkIfCampAuthorLax(req, res, next){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      return res.redirect("back");
    }
    if(req.user){
      if(campground.author.id.equals(req.user._id)){
    
        res.locals.isCampOwner = true;
        next();
      }
      else{
        next();
      }
    }
    else{
      next();
    }
  });
};
  


module.exports = router;