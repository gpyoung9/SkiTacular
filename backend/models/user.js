// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema   = new mongoose.Schema({
    email : {type: String, required : true, unique : true},
    password : {type: String, required : true},
    favoriteResorts : [String],
    historyResorts : [String]
});

// Export the Mongoose model
module.exports = mongoose.model('user', UserSchema);
