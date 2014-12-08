var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

var users = express.Router();

users.post('/login', function(req, res) {

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return res.error(err);
		}
		if (!user) {
			return res.error(info.message);
		}
		req.logIn(user, function(err) {
			if (err) { 
				return res.error(err); 
			}
			// delete user.salt;
			// delete user.password;


			// return res.success(user);
			return res.redirect('/api/user/' + user.id);
		});
	})(req, res);

});

users.post('/logout', function(req, res) {
	req.logout();
	res.success();
});

users.post('/register', function(req, res) {
	
	// for security measurement we remove the roles from the req.body object
	// since the roles could have been manually set by the client
	delete req.body.roles;

	var user = new User(req.body);

	user.save(function(err) {
		if (err) {
			return res.error(400, err);
		}

		// remove sensitive data before login
		user.password = undefined;
		user.salt = undefined;

		req.login(user, function(err) {
			if (err) {
				return res.error(400, err);
			}

			return res.success(user);
		});
	});

});


module.exports = users;