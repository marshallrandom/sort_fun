var mongoose = require("mongoose");

var savedListItemSchema = new mongoose.Schema({
    ordernum : Number,
    name: String,
    image: String,
    description: String,
    savedlistid : String
}
);


module.exports = mongoose.model("savedListItem", savedListItemSchema);
