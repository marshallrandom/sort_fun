var mongoose = require("mongoose");

var savedListSchema = new mongoose.Schema({
   propertycompare : String,
   sortname: String,
   userid: String, 
   saveddate : String,
   listitems_md5 : String,
   sortedorder_md5 : String,
   unpublished : Boolean

});

module.exports =  mongoose.model("savedList", savedListSchema);
