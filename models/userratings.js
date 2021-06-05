var mongoose = require("mongoose");

var savedListSchema = new mongoose.Schema({
   userid: String, 
   saveddate : String,
   listid : String,
   listrating : Number,
   comparisonrating : Number,
   ratingcomment : String
});

module.exports =  mongoose.model("userratingList", savedListSchema);
