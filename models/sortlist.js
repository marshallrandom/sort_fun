var mongoose = require("mongoose");

var sortListSchema = new mongoose.Schema({
   propertycompare : String,
   sortname: String,
   userid: String,
   percentcompleted : Number,
   listitems_md5 : String
});

module.exports =  mongoose.model("sortList", sortListSchema);
