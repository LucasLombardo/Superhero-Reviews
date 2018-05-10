var express = require("express");
var router  = express.Router();
var Superhero = require("../models/superhero");
var middleware = require("../middleware");


//INDEX - show all superheroes
router.get("/", function(req, res){
    // Get all superheroes from DB
    Superhero.find({}, function(err, allSuperheroes){
       if(err){
           console.log(err);
       } else {
          //if no error, pass the superheroes into superhero index view
          res.render("superheroes/index",{superheroes:allSuperheroes});
       }
    });
});

//CREATE - add new superhero to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form/curr time and add to superheroes array
    var name    = req.body.name;
    var image   = req.body.image;
    var civ     = req.body.civname;
    var loc     = req.body.location;
    var desc    = req.body.description;
    var rate    = 0;
    var date    = new Date();
    var mod     = new Date();
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newSuperhero = {name: name, image: image, civname: civ, location: loc, description: desc, rating: rate, dateadded: date, datemodified: mod, author:author};
    // Create a new superhero and save to DB
    Superhero.create(newSuperhero, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to superheroes page
            console.log(newlyCreated);
            res.redirect("/superheroes");
        }
    });
});

//NEW - show form to create new superhero
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("superheroes/new"); 
});

// SHOW - shows more info about one superhero
router.get("/:id", function(req, res){
    //find the superhero with provided ID
    Superhero.findById(req.params.id).populate("comments").exec(function(err, foundSuperhero){
        if(err){
            console.log(err);
        } else {
            console.log(foundSuperhero)
            //render show template with that superhero
            res.render("superheroes/show", {superhero: foundSuperhero});
        }
    });
});

// EDIT SUPERHERO ROUTE
router.get("/:id/edit", middleware.checkSuperheroOwnership, function(req, res){
    Superhero.findById(req.params.id, function(err, foundSuperhero){
        res.render("superheroes/edit", {superhero: foundSuperhero});
    });
});

// UPDATE SUPERHERO ROUTE
router.put("/:id",middleware.checkSuperheroOwnership, function(req, res){
    // find and update the correct superhero
    Superhero.findByIdAndUpdate(req.params.id, req.body.superhero, function(err, updatedSuperhero){
       if(err){
           res.redirect("/superheroes");
       } else {
           //redirect somewhere(show page)
           res.redirect("/superheroes/" + req.params.id);
       }
    });
});

// DESTROY SUPERHERO ROUTE
router.delete("/:id",middleware.checkSuperheroOwnership, function(req, res){
   Superhero.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/superheroes");
      } else {
          res.redirect("/superheroes");
      }
   });
});


module.exports = router;

