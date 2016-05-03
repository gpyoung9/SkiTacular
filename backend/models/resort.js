// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ResortSchema   = new mongoose.Schema({
    name : {type: String, required : true},
    URL : {type: String, required : true},
    Img_URL : {type: String},
    Location : {type: String, required : true},
    Price : {type : Number, required : true},
    Discount_price : {type : Number, required : true},
    Percent_trails_open : {type : Number},
    Discription: {type : String},
    Distance : {type: Number},
    Latitude : {type: Number},
    Longitude : {type: Number}
});

// Export the Mongoose model
module.exports = mongoose.model('resort', ResortSchema);
