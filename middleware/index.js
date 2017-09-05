const Campground = require("../models/campground");
const Comment = require("../models/comment");
const User = require("../models/user");

class AuthObj {

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', "Please log in to proceed")
    res.redirect("/login");
  }

  checkCommentOwner(req, res, next) {
      Comment.findById(req.params.comment_id)
        .then((comment) => {
          if (comment.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          }
          else {
            req.flash('error', "You're not authorised to modify this comment.")
            res.redirect("back");
          }
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', "Something bad happened...Please try again.")
          res.redirect("back");
        })
  }


  checkIfCampAuthor(req, res, next) {
    Campground.findById(req.params.id, function (err, campground) {
      if (err) {
        req.flash('error', "Something bad happened...Please try again.")
        return res.redirect("back");
      }
      if (campground.author.id.equals(req.user._id) || req.user.isAdmin) {
        next();
      }
      else {
        req.flash('error', "You're not authorised to modify this user profile.")
        return res.redirect("back");
      }
    });
  };

  checkIfAuthor(req, res, next) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        req.flash('error', "Something bad happened...Please try again.")
        return res.redirect("back");
      }
      if (user._id.equals(req.user._id) || req.user.isAdmin) {
        next();
      }
      else {
        req.flash('error', "You're not authorised to modify this campground.")
        return res.redirect("back");
      }
    });
  };


}


module.exports = new AuthObj();