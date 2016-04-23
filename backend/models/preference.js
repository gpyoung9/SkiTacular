// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var PreferenceSchema   = new mongoose.Schema({
    email : {type: String, required : true, unique : true},
    price : {type: Number},
    Distance : {type: Number}
});

// Export the Mongoose model
module.exports = mongoose.model('preference', PreferenceSchema);
