var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    rating: Number,
    text: String,
    dateadded: Object,
    datemodified: Object,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);