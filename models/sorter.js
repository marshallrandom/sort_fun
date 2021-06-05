var mongoose = require("mongoose");

var sorterSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   listname: String,
   userid: String
});

module.exports = mongoose.model("Sorter", sorterSchema);