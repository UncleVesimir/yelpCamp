const router = require('express').Router();
const Campground = require("../models/campground");
const isLoggedIn = require("../middleware/index").isLoggedIn;
const checkIfCampAuthor = require("../middleware/index").checkIfCampAuthor;

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
  //  console.log(`Added new Camp Ground:\n ${addedCamp}`)
   res.redirect("/campgrounds");
 }).catch((err)=>console.log(err))
});

router.get("/:id", function(req, res){

  Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCamp) =>{
      res.render("campgrounds/show", {campground: foundCamp});
    })
    .catch((err) => {console.log(err)}); 
});


//UPDATE Campground
router.get("/:id/edit", isLoggedIn, checkIfCampAuthor, function(req, res){
  Campground.findById(req.params.id)
    .then((campground)=>{
       res.render("campgrounds/edit", {campground:campground});
    });
});

router.put("/:id", isLoggedIn, checkIfCampAuthor, function(req, res){
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
router.delete("/:id", isLoggedIn, checkIfCampAuthor, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }
    res.redirect("/campgrounds");
  })
});





module.exports = router;