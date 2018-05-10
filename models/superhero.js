var mongoose = require("mongoose");

var superheroSchema = new mongoose.Schema({
   name: String,
   image: String,
   civname: String,
   location: String,
   description: String,
   rating: Number,
   dateadded: Object,
   datemodified: Object,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Superhero", superheroSchema);