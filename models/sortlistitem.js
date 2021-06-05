var mongoose = require("mongoose");

var sortListItemSchema = new mongoose.Schema({
    ordernum : Number,
    name: String,
    image: String,
    description: String,
    sortlistid : String
}
);


module.exports = mongoose.model("sortListItem", sortListItemSchema);
