// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
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

usersRoute.get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(500);
            res.json({ message : "We don't know what happened!", data : []});
            return;
        }
        res.json({ message : "OK", data : users});
    });
});

usersRoute.post(function(req, res) {
    if(req.body.password != undefined){
        console.log(req.body.password);
    }
    var newUser = new User({name: req.body.name, email: req.body.email, password: req.body.password});
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

resortsRoute.get(function(req, res) {
    Resort.find(function(err, resorts) {
        if (err) {
            res.status(500);
            res.json({ message : "We don't know what happened!", data : []});
            return;
        }
        res.json({ message : "OK", data : resorts});
    });
});

resortsRoute.post(function(req, res) {
    Resort.create(req.body, function(err, resort) {
        if (err) {
            res.status(500);
            res.json({ message : "This email already exists", data : []});
            return;
        }
        res.status(201);
        res.json({ message : 'Resort added', data : resort});
    });
})

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
                res.json({ message : "We don't know what happened!", data : []});
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


// Start the server
app.listen(port);
console.log('Server running on port ' + port);
