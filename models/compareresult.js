var mongoose = require("mongoose");


var compareResultSchema = new mongoose.Schema({
    firstitem : String,
    seconditem : String,
    sortlistid : String,
    reason     : String,
    result : Number



});

module.exports = mongoose.model('compareresults', compareResultSchema, 'compareresults');
