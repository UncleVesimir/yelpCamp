const router = require('express').Router();
const User = require('../models/user');
const Campground = require('../models/campground');
const isLoggedIn = require("../middleware/index").isLoggedIn;
const checkIfAuthor = require("../middleware/index").checkIfAuthor;





router.get('/:id/edit', isLoggedIn, checkIfAuthor, function(req, res){
  User.findById(req.params.id).then((user)=>{
    return res.render('users/edit', {user: user});
  }).catch((err)=>{
    req.flash('error', 'Could not find user');
  })
});
//Get user profile
router.get('/:id', function(req, res){
  User.findById(req.params.id).then((user)=>{
    return user
}).then((user)=>{
  Campground.find({'author.id':user.id}).then((userCreatedCamps)=>{
    if(userCreatedCamps === null){
      userCreatedCamps = { noCamps: true};
    }
    return res.render('users/show', {user:user, userCreatedCamps: userCreatedCamps});
  }).catch((err)=>{
    req.flash('err', "Error retrieving user's campgrounds");
    return res.redirect('back')
  })
}).catch((err)=>{
  res.flash('error', 'Could not find user');
  return res.redirect('back');
})
});
//edit user profile



router.put("/:id", isLoggedIn, checkIfAuthor, function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body.updatedUser, function(err, updatedUser){
    if(err){
      req.flash('error', 'An error occured whilst updating your profile. Please try again. If the problem persists, please contact support.');
      res.direct('/users/'+ updatedUser.id);
    }
    else{
      req.flash('succes', 'Successfully updated your user profile!')
      res.direct('/users/'+ updatedUser.id);
    }
  })
});

module.exports = router;