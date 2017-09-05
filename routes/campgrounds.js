const router = require('express').Router();
const Campground = require("../models/campground");
const isLoggedIn = require("../middleware/index").isLoggedIn;
const checkIfCampAuthor = require("../middleware/index").checkIfCampAuthor;
const geocoder = require("geocoder");

router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.error(err);
    }
    res.render("campgrounds/index", {campgrounds: allCampgrounds, page:'campgrounds'});
    });
});

//CREATE Campground

router.get("/new", isLoggedIn, function(req, res){
  res.render('campgrounds/newGround');
});

router.post("/", isLoggedIn, function(req, res){
  geocoder.geocode(req.body.location, function(err, data){

    let lat = data.results[0].geometry.location.lat;
    let lng = data.results[0].geometry.location.lng;
    let location = data.results[0].formatted_address;

    let newCamp = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      location: location,
      lat: lat,
      lng: lng,
      author:{
        id: req.user._id,
        username:req.user.username
      }
    };

    Campground.create(newCamp).then((addedCamp)=>{
      //  console.log(`Added new Camp Ground:\n ${addedCamp}`)
       req.flash("success", "Campground successfully added!");
       res.redirect("/campgrounds");
     }).catch((err)=>{
      req.flash('error', "Failed to create campground");
      res.redirect("/campgrounds");
       console.log(err)})
  })

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

  geocoder.geocode(req.body.campground.location, function(err, data){
      if(err){
      // req.flash('error', "Something wrong with Location entered");
      // res.redirect("back");
      return;
    }
        let lat = data.results[0].geometry.location.lat;
        let lng = data.results[0].geometry.location.lng;
        let location = data.results[0].formatted_address;
    
        let campUpdate = req.body.campground;

        campUpdate["lat"] = lat;
        campUpdate["lng"] = lng;
        campUpdate.location = location;
          

        Campground.findByIdAndUpdate(req.params.id, campUpdate, function(err, updatedCamp){
          if(err){
            req.flash('error', err.message)
            res.redirect("back");
          }
          else{

            req.flash("success", "Camp successfully updated!");
            res.redirect("/campgrounds/" + updatedCamp._id);
          }
        })

      })

 
})

//DELETE
router.delete("/:id", isLoggedIn, checkIfCampAuthor, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }
    req.flash('success', "Campground deleted.")
    res.redirect("/campgrounds");
  })
});





module.exports = router;