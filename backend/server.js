// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var https = require('https');
var request = require("request"); // use command: npm install request if you see package not found error
var User = require('./models/user');
var Resort = require('./models/resort');
var Preference = require('./models/preference');
var bodyParser = require('body-parser');
var router = express.Router();
// passport requires
var passport = require('passport');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');


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

require('./app/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'passport demo' }));
app.use(express.static(__dirname + '/frontend/public'));


app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Authorization, Accept");
    if ('OPTIONS' == req.method) {
	    res.sendStatus(200);
    }
    else {
    	next();
    }
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
            else {
                console.log("number of resorts " + lists.length);
                res.json({message: "ok", data: lists});
            }

        });
    }
}

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

//User Favorites route
var userFavoriteResortsRoute = router.route('/users/:user_id/favorite/');

userFavoriteResortsRoute.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err || user === null) {
            res.status(404);
            res.json({ message : "User not found", data : []});
            return;
        }
        Resort.find().where({"_id": {"$in": user.favoriteResorts}}).exec(function(err, resorts) {
            if(err)
                res.status(500).json({message: "error", data: err});
            else {
                res.json({message: "ok", data: resorts});
            }
        });
    });
});

var userFavoriteResortRoute = router.route('/users/:user_id/favorite/:resort_id');


userFavoriteResortRoute.post(function(req, res) {
    User.findById(req.params.user_id, function(err, old_user) {
        if (err || old_user === null) {
            res.status(404);
            res.json({ message : "User not found", data : []});
            return;
        }
        old_user.favoriteResorts.push(req.params.resort_id);
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

userFavoriteResortRoute.delete(function(req, res) {
    User.findById(req.params.user_id, function(err, old_user) {
        if (err || old_user === null) {
            res.status(404);
            res.json({ message : "User not found", data : []});
            return;
        }

        if (req.params.resort_id === "" || typeof req.params.resort_id === "undefined") {
            res.status(500);
            res.json({ message : "A resort ID is required!", data : []});
            return;
        }

        var idx = old_user.favoriteResorts.indexOf(req.params.resort_id);
        if (idx > -1) {
            old_user.favoriteResorts.splice(idx, 1);
        } else {
            res.status(404);
            res.json({ message : "ID not in favorites.", data : []});
            return;
        }
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

//User Favorite Resort route
// var userFavoriteResortRoute = router.route('/users/:user_id/favorite/:resort_id');
//
// userFavoriteResortRoute.get(function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//         if (err || user === null) {
//             res.status(404);
//             res.json({ message : "User not found", data : []});
//             return;
//         }
//         Resort.findById(req.params.resort_id, function(err, resort) {
//             if (err || resort === null) {
//                 res.status(404);
//                 res.json({ message : "Resort not found", data : []});
//                 return;
//             }
//             res.json({ message : "OK", data : resort});
//         });
//     });
// });
//
// userFavoriteResortRoute.delete(function(req, res) {
//     User.findById(req.params.user_id, function(err, old_user) {
//         if (err || user === null) {
//             res.status(404);
//             res.json({ message : "User not found", data : []});
//             return;
//         }
//         var idx = old_user.favoriteResorts.indexOf(req.params.resort_id);
//         if (idx > -1) {
//             old_user.favoriteResorts.splice(idx, 1);
//         }
//         old_user.save(function(err, new_user) {
//             if (err) {
//                 res.status(500);
//                 res.json({ message : "We don't know what happened!", data : []});
//                 return;
//             }
//             // return user with updated info
//             User.findById(old_user._id, function(err, new_info) {
//                 if (err) {
//                     res.status(500);
//                     res.json({ message : "We don't know what happened!", data : []});
//                     return;
//                 }
//                 res.json({ message : "User updated", data : new_info});
//             });
//         });
//     });
// });

//Resorts route
var resortsRoute = router.route('/resorts');

resortsRoute.get(httpGet(Resort));

resortsRoute.post(function(req, res) {
    var newResort = new Resort({name: req.body.name, Location: req.body.Location,
        Price: req.body.Price, Discount_price: req.body.Discount_price,
        URL: req.body.URL, Img_URL: req.body.Img_URL,
        Percent_trails_open: req.body.Percent_trails_open, Description : req.body.Description,
        Distance: req.body.Distance,
        Latitude: req.body.Latitude ,Longitude: req.body.Longitude});
    newResort.save(function(err){
        if(err){
            res.status(500);
            res.json({message: "error in saving to db", error: err});
        }
        else
            res.status(201).json({message: "Resort added", data: newResort});
    });
});

var resortsRandomRoute = router.route('/resorts/random/');

resortsRandomRoute.get(function(req, res){
    var r = Math.floor(Math.random() * 168);
    var randomElement = Resort.find().limit(1).skip(r).exec(
    function(err, samples){
         if(err){
            res.status(500);
            res.json({message: "error in finding random samples", error: err});
        }
        else
            res.status(201).json({message: "random resorts", data: samples});
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
            if(resJson.results[0] != undefined){
                var destination = resJson.results[0].geometry.location;
                googleDistQuery(origin.Latitude, origin.Longitude, destination.lat, destination.lng);
            }
            else
                sendBackResult(1000000);
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
                    var resJson = JSON.parse(data);
                    console.log(resJson);
                    var ret = 1000000; //unreliable distance
                    if(resJson.rows != undefined && resJson.rows[0] != undefined && resJson.rows[0].elements[0].distance != undefined)
                        ret = parseFloat(resJson.rows[0].elements[0].distance.text.replace(/,/i, ''));
                    sendBackResult(ret);
                    //sendBackResult("dd");
                });
            };

            https.request(options, callback).end();
        };
        var sendBackResult = function(distance){
            res.json({ message : "distance calculated", data : distance});
        }
    });
});

var batchDistanceUpdateRoute = router.route('/distances/:zipcode');

batchDistanceUpdateRoute.put(function(req, res){

    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(req.params.zipcode);
    if(!isValidZip){
        req.params.zipcode = "61801"; //set urbana as default location
    }

    var allUpdate = function(lists, r, distances, queryLimit){
        if(r >= lists.length){

            var bulk = Resort.collection.initializeUnorderedBulkOp();
            Resort.findByIdAndUpdate('572b98bc24f9d93614ea120a', {Distance : 233}, function(err, resort){
                console.log(resort);
            } );
            for(r in lists){
                console.log(lists[r]._id);
                console.log(distances[r]);
                bulk.find({name: lists[r].name}).update({$set: { Distance : distances[r]}});
            }

            bulk.execute(function(err, got) {
                if(err)
                    console.log(err);
                else
                    console.log(got);
                res.json({message: "distance updated"});
            });
            return;
        }
        var googleQueryStr = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
            + req.params.zipcode + '&destinations=';

        for(var i = r; i < Math.min(lists.length, r + queryLimit); i++){
            googleQueryStr += lists[i].Latitude +'%2C'+ lists[i].Longitude +'%7C';
        }
        googleQueryStr += '&key=AIzaSyDlPhwrvT97gH5WRVrjmiT1ZeItaE5AZt4';
        request({
            url: googleQueryStr,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
                var result = JSON.parse(JSON.stringify(body)).rows[0].elements;
                for (var i = 0; i < result.length; i++){
                    distances[i+r] = 100000;
                    if(result[i].distance !=undefined)
                        distances[i+r]  = parseFloat(result[i].distance.text.replace(/,/i, ''));
                }
            }
            else
                console.log(error);
            allUpdate(lists, r+queryLimit, distances, queryLimit);
        });
    }

    console.log("current zip code: " + req.params.zipcode);
    var query = Resort.find();
    query.exec(function(err, lists){
        if(err)
            res.status(500).json({message: "db search error", data: err});
        else{
            lists = JSON.parse(JSON.stringify(lists));
            allUpdate(lists, 0, new Array(lists.length), 20);

            // for(r in lists){
            //     var queryStr = 'http://localhost:4000/api/distance/'+ req.params.zipcode + '/' + lists[r]._id;
            //     request({
            //         url: queryStr,
            //         json: true
            //     }, function (error, response, body) {
            //         if (!error && response.statusCode === 200) {
            //             console.log(body.data);
            //             Resort.findOneAndUpdate({ _id: lists[r]._id }, {$set: {Distance: body.data}}, function (err, obj){
            //                 if(err)
            //                     console.log(err);
            //                 else
            //                     console.log('success');
            //             });
            //         }
            //         else
            //             console.log(error);
            //     });
        }
            // findOneAndUpdate
            //res.json({message: "distance updated"});
           //}
    });
});





// Start the server
app.listen(port);
console.log('Server running on port ' + port);
