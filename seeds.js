const mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

const data = [
  {
    name: "Cloud's Rest",
    image: "https://source.unsplash.com/sK1hW5knKkw/1600x900",
    description: "A tranquil site, amongst the clouds..."
  },
  {
    name: "Wyconin Lake",
    image: "https://source.unsplash.com/n3XTxxV7qhI/1600x900",
    description: "Not a single ripple ushers across this peaceful lake"
  },
  {
    name: "Night's Canyon",
    image: "https://source.unsplash.com/0gHru-hk2Qw/1600x900",
    description: "A rocky enclosure almost hides away this beautiful desert secret"
  },
  {
    name: "Old Mal's",
    image: "https://source.unsplash.com/zQgsdQvj1IM/1600x900",
    description: "All are welcome at Old Mal's, but you've got to earn your keep!"
  },
  {
    name: "Middnight Forrest",
    image: "https://source.unsplash.com/qmZF9CptLKs/1600x900",
    description: "Bring your tea lights and an open mind. Middnight Forrest is for those of a creative spirit."
  },

]

function seedDB() {
  Campground.remove({}, function (err) {
    if (err) { console.log(err) }
    else {
      console.log("Removed campgrounds!");

      data.forEach(function (camp) {
        Campground.create(camp, function (err, addedCamp) {
          if (err) {
            console.log(err)
          }
          else{
            Comment.create(
              {
                text: "This campground is great, but I wish there was Internet...",
                author: "Homer"
              },
              function(err, comment){
                if(err){
                  console.log(err);
                }
                else{
                  addedCamp.comments.push(comment);
                  addedCamp.save();
                }
              }
            )
          }
        })
      });

      console.log("Seeded grounds added");
    }
  });


}

module.exports = seedDB;