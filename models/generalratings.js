var mongoose = require("mongoose");

var generalRatingsSchema = new mongoose.Schema({
   userid: String, 
   saveddate : String,
   listid : String,
   imagerating : Number,
   itemrating : Number,
   itemdescripitonrating : Number,
   ratingcomment : String

});

module.exports =  mongoose.model("generalRatings", generalRatingsSchema);
