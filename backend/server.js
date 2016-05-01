// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var https = require('https');
var User = require('./models/user');
var Resort = require('./models/resort');
var Preference = require('./models/preference');
var bodyParser = require('body-parser');
var router = express.Router();


//replace this with your Mongolab URL
mongoose.connect('mongodb://user:pw@ds019101.mlab.com:19101/498final', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection to 498db successful');
    }
});

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Users route
var usersRoute = router.route('/users');

function httpGet(model) {
    return function(req, res){
        var where = eval("("+req.query.where+")");
        var sort = eval("("+req.query.sort+")");
        var select = eval("("+req.query.select+")");
        var limit = eval("("+req.query.limit+")");
        var skip = eval("("+req.query.skip+")");
        var count = eval("("+req.query.count+")");
        var query;
        if(where != undefined){
            query = model.find(where);
        }
        else{
            query = model.find();
        }   
        if(count != undefined){
            query = query.count(count);
        }
        query
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(select)
        .exec(function(err, lists){
            if(err)
                res.status(500).json({message: "error", data: err});    
            else
                res.json({message: "ok", data: lists});     
        });
    }   
}

// usersRoute.get(function(req, res) {
//     User.find(function(err, users) {
//         if (err) {
//             res.status(500);
//             res.json({ message : "We don't know what happened!", data : []});
//             return;
//         }
//         res.json({ message : "OK", data : users});
//     });
// });
usersRoute.get(httpGet(User));


usersRoute.post(function(req, res) {
    if(req.body.password != undefined){
        console.log(req.body.password);
    }

    var newUser = new User({name: req.body.name, email: req.body.email, password: req.body.password, zipcode: req.body.zipcode != undefined ? req.body.zipcode : 61801 });
    newUser.save(function(err){    
            if(err){
                res.json({message: "error in saving to db", error: err});
            }
            else
                res.status(201).json({message: "ok", data: newUser});       
        });
})

//User route
var userRoute = router.route('/users/:user_id');

userRoute.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err || user === null) {
            res.status(404);
            res.json({ message : "User not found", data : []});
            return;
        }
        res.json({ message : "OK", data : user});
    });
});

userRoute.put(function(req, res) {
    User.findById(req.params.user_id, function(err, old_user) {
        old_user.zipcode = req.body.zipcode;
        console.log(old_user);
        old_user.save(function(err, new_user) {
            if (err) {
                res.status(500);
                res.json({ message : "We don't know what happened!", data : []});
                return;
            }
            // return user with updated info
            User.findById(old_user._id, function(err, new_info) {
                if (err) {
                    res.status(500);
                    res.json({ message : "We don't know what happened!", data : []});
                    return;
                }
                res.json({ message : "User updated", data : new_info});
            });
        });
    });
});

userRoute.delete(function(req, res) {
    User.findByIdAndRemove(req.params.user_id, function(err, user) {
        if (err || user === null) {
            res.status(404);
            res.json({ message : "User not found", data : []});
            return;
        }
        res.json({ message : "User deleted", data : []});
    });
});

//Resorts route
var resortsRoute = router.route('/resorts');

// resortsRoute.get(function(req, res) {
//     Resort.find(function(err, resorts) {
//         if (err) {
//             res.status(500);
//             res.json({ message : "We don't know what happened!", data : []});
//             return;
//         }
//         res.json({ message : "OK", data : resorts});
//     });
// });

resortsRoute.get(httpGet(Resort));



resortsRoute.post(function(req, res) {

    var newResort = new Resort({name: req.body.name, Location: req.body.Location, Price: req.body.Price, URL: req.body.URL, Distance: req.body.Distance, Latitude: req.body.Latitude ,Longitude: req.body.Longitude});
    newResort.save(function(err){    
        if(err){
            res.status(500);
            res.json({message: "error in saving to db", error: err});
        }
        else
            res.status(201).json({message: "Resort added", data: newResort});       
    });  
});

//Resort route
var resortIdRoute = router.route('/resorts/:resort_id');

resortIdRoute.get(function(req, res) {
    Resort.findById(req.params.resort_id, function(err, resort) {
        if (err || resort === null) {
            res.status(404);
            res.json({ message : "Resort not found", data : []});
            return;
        }
        res.json({ message : "OK", data : resort});
    });
});

resortIdRoute.put(function(req, res) {
    Resort.findById(req.params.resort_id, function(err, old_resort) {
        old_resort.save(function(err, new_resort) {
            if (err) {
                res.status(500);
                res.json({ message : "We don't know what happened!", data : err});
                return;
            }
            // return resort with updated info
            Resort.findById(old_resort._id, function(err, new_info) {
                if (err) {
                    res.status(500);
                    res.json({ message : "We don't know what happened!", data : []});
                    return;
                }
                res.json({ message : "Resort updated", data : new_info});
            });
        });
    });
});

resortIdRoute.delete(function(req, res) {
    Resort.findByIdAndRemove(req.params.resort_id, function(err, resort) {
        if (err || resort === null) {
            res.status(404);
            res.json({ message : "Resort not found", data : []});
            return;
        }
        res.json({ message : "Resort deleted", data : []});
    });
});


var distanceRoute = router.route('/distance/:zipcode/:resort_id');

distanceRoute.get(function(req, res){
    Resort.findById(req.params.resort_id, function(err, origin) {

        if(err){
            res.status(500);
            res.json({ message : "server side error", data : err});
            console.log(err);
            return;
        }
        var options = {
          host: 'maps.googleapis.com',
          path: '/maps/api/geocode/json?address=' + req.params.zipcode
        };

        callback = function(response) {
          var data = '';

          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            data += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function() {
            var resJson = JSON.parse(data);
            var destination = resJson.results[0].geometry.location;
            googleDistQuery(origin.Latitude, origin.Longitude, destination.lat, destination.lng);
          });
        };

        http.request(options, callback).end();
        
        var googleDistQuery = function(originLat, originLng, destLat, destLng){
            var options = {
              host: 'maps.googleapis.com',
              path: '/maps/api/distancematrix/json?units=imperial&origins=' + originLat +
              ','+ originLng + '&destinations='+ destLat +'%2C'+ destLng
               +'%7C&key=AIzaSyDlPhwrvT97gH5WRVrjmiT1ZeItaE5AZt4'
            };

            callback = function(response) {
                var data = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    data += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function() {
                    console.log(data);
                    // var resJson = JSON.parse(data);
                    // console.log(resJson);
                    sendBackResult();
                });
            };
         
            https.request(options, callback).end();                
        };
        var sendBackResult = function(){
            res.json({ message : "distance calculated", data : "ss"});
        }

        //resort.Longitude
        // 'http://maps.googleapis.com/maps/api/geocode/json?address=050000'
    });
});


// Start the server
app.listen(port);
console.log('Server running on port ' + port);
