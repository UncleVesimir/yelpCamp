const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      seedDB = require("./seeds");


seedDB();

const Campground = require("./models/campground");



mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true} );
mongoose.Promise = global.Promise;


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));


//////////////// MONGOOSE SCHEMA AND MODEL/////////////


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
  res.render("index", {campgrounds: allCampgrounds});
})

});



app.get("/campgrounds/new", function(req, res){
  res.render('newGround');
});

app.get("/campgrounds/:id", function (req, res){

  Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCamp) =>{
      res.render("show", {campground: foundCamp});
    })
    .catch((err) => {console.log(err)}) 
});

app.post("/campgrounds", function(req, res){
  let name = req.body.name;
  let img = req.body.image;
  let description = req.body.description;
  let newCamp = {name: name, image: img, description: description};

 Campground.create(newCamp).then((addedCamp)=>{
   console.log(`Added new Camp Ground:\n ${addedCamp}`)
   res.redirect("/campgrounds");
 }).catch((err)=>console.log(err))

   

 });