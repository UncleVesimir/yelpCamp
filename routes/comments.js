const router = require('express').Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const AuthCheck = require("../middleware/index");

const checkCommentOwner = AuthCheck.checkCommentOwner;

//New
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

//Create
router.post("/", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds" + req.params.id);
    }
    else{
      Comment.create(req.body.comment)
        .then((comment)=>{
         
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

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


//Edit
router.get("/:comment_id/edit", checkCommentOwner, function(req, res){
  
  Comment.findById(req.params.comment_id)
    .then((comment)=>{
      res.render("comments/edit", 
      {campgroundParam: req.params.id,
        comment: comment
      });
    })
    .catch((err)=>{
      console.log(err);
      res.redirect('back');
    });
  
});

//Update
router.put("/:comment_id", checkCommentOwner, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .then(()=>{
      res.redirect(`/campgrounds/${req.params.id}`);
    })
    .catch((err)=>{
      console.log(err);
      res.redirect('back')
    })
});

//Destroy
router.delete('/:comment_id',checkCommentOwner, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(()=>{
      res.redirect(`/campgrounds/${req.params.id}`);
    })
    .catch((err)=>{
      res.redirect(`/campgrounds/${req.params.id}`);
    })
})
module.exports = router;
