const router = require('express').Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/new", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }
    else{
      res.render("comments/new", {campground: campground});
    }
  })
  
});

router.post("/", function(req,res){
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

module.exports = router;