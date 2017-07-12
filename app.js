const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');


//  campgroundsArray = [
//   {name: "Salmon Creek", image: "http://www.ardnamurchanstudycentre.co.uk/images/campsiteview.jpg"},
//   {name: "Granite Hill", image: "https://coolcamping.com/system/images/369/great-langdale-national-trust-campsite-large.jpg"},
//   {name: "Mountain Goat's Rest", image: "http://dismalscanyon.com/campsites/images/sleeping_water_5177_900px.jpg"},
//   {name: "Tight-Nose Pass", image: "http://www.dunvegancastle.com/wp-content/uploads/2016/05/Glenbrittle-campsite-4.jpg"},
//   {name: "Dunwall Canyon", image: "https://s-media-cache-ak0.pinimg.com/736x/58/72/ba/5872ba6c61d63ad851f1d1e5640f9ab4--camping-wild-camping-places.jpg"},
//   {name: "Brough Gill", image: "https://s-media-cache-ak0.pinimg.com/736x/86/6f/a3/866fa375624de6eddece752f5e100d4e.jpg"},
// ]



mongoose.connect("mongodb://localhost/yelp_camp",
{useMongoClient:true}
);


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));


//////////////// MONGOOSE SCHEMA AND MODEL/////////////

const campGroundSchema = new mongoose.Schema({
  name: String,
  image: String
})

const Campground = mongoose.model('Campground', campGroundSchema);
/////////////////////////////////////////////

app.listen(process.env.PORT || 8000, function (){
  console.log("Yelp Camp Server running - Listening on port 8000");
});

app.get("/", function (req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
Campground.find({}, function(err, allCampgrounds){
  if(err){
    console.error(err);
  }
  res.render("campgrounds", {campgrounds: allCampgrounds});
})

});

app.get("/campgrounds/new", function(req, res){
  res.render('newGround');
});


app.post("/campgrounds", function(req, res){
  let name = req.body.name;
  let img = req.body.image;
  let newCamp = {name: name, image: img};
  
 Campground.create(newCamp).then((addedCamp)=>{
   console.log(`Added new Camp Ground:\n ${addedCamp}`)
   res.redirect("/campgrounds");
 }).catch((err)=>console.log(err))

   

 });