var express = require("express");
var router  = express.Router({mergeParams: true});
var Superhero = require("../models/superhero");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find superhero by id
    console.log(req.params.id);
    Superhero.findById(req.params.id, function(err, superhero){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {superhero: superhero});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup superhero using ID
   Superhero.findById(req.params.id, function(err, superhero){
       if(err){
           console.log(err);
           res.redirect("/superheroes");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //add current time/date to comment
               comment.dateadded = new Date();
               comment.datemodified = new Date();
               //save comment
               comment.save();
               superhero.comments.push(comment);
               superhero.save();
              //find the superhero with provided ID and update rating
              Superhero.findById(req.params.id).populate("comments").exec(function(err, foundSuperhero){
                    if(err){
                        console.log(err);
                    } else {
                        var ratings = foundSuperhero.comments.map(c => c.rating);
                        ratings.push(comment.rating);
                        var averageRating = Math.round(ratings.reduce((accum, n)=>accum+n, 0)/ratings.length);
                        foundSuperhero.rating = averageRating;
                        foundSuperhero.ratingstotal = ratings.length;
                        foundSuperhero.save();
                    }
              });
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/superheroes/' + superhero._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {superhero_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // set lastmodified to current time
    req.body.comment.datemodified = new Date();
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/superheroes/" + req.params.id );
      }
    });
    //update average rating
    Superhero.findById(req.params.id).populate("comments").exec(function(err, foundSuperhero){
        if(err){
            console.log(err);
        } else {
            var ratings = foundSuperhero.comments.map(c => c.rating);
            var averageRating = Math.round(ratings.reduce((accum, n)=>accum+n, 0)/ratings.length);
            foundSuperhero.rating = averageRating;
            foundSuperhero.save();
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/superheroes/" + req.params.id);
       }
    });
    //find the superhero with provided ID and update rating
    Superhero.findById(req.params.id).populate("comments").exec(function(err, foundSuperhero){
        if(err){
            console.log(err);
        } else {
            var ratings = foundSuperhero.comments.map(c => c.rating);
            var averageRating = Math.round(ratings.reduce((accum, n)=>accum+n, 0)/ratings.length) || 0;
            foundSuperhero.rating = averageRating;
            foundSuperhero.ratingstotal-= 1;
            foundSuperhero.save();
        }
    });
});

module.exports = router;