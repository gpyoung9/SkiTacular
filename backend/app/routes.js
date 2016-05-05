module.exports = function(app, passport) {

	app.post('/api/signup', passport.authenticate('signup'), function(req, res) {
        res.json({
            user: req.user
        });
	});

	app.post('/api/login', passport.authenticate('login'), function(req, res) {
		res.json({
            user: req.user
        });
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.json({
			user: req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();

		res.json({
			error: "User not logged in"
		});
	}

};
