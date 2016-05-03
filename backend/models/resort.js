// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ResortSchema   = new mongoose.Schema({
    name : {type: String, required : true},
    URL : {type: String, required : true},
    Location : {type: String, required : true},
    Price : {type : Number, required : true},
    Distance : {type: Number},
    Latitude : {type: Number},
    Longitude : {type: Number}
});

// Export the Mongoose model
module.exports = mongoose.model('resort', ResortSchema);
