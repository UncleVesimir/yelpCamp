const Campground = require("../models/campground");
const Comment = require("../models/comment");

class AuthObj {

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  checkCommentOwner(req, res, next) {
      Comment.findById(req.params.comment_id)
        .then((comment) => {
          if (comment.author.id.equals(req.user._id)) {
            next();
          }
          else {
            res.redirect("back");
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("back");
        })
  }


  checkIfCampAuthor(req, res, next) {
    Campground.findById(req.params.id, function (err, campground) {
      if (err) {
        return res.redirect("back");
      }
      if (campground.author.id.equals(req.user._id)) {
        next();
      }
      else {
        return res.redirect("back");
      }
    });
  };


}


module.exports = new AuthObj();