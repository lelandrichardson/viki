var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var users = express.Router();

users.get('/:id', function(req, res) {
	var id = req.param('id');
	User.findById(id).lean().exec(function(err, user) {
		if (err) {
			res.error(404, "user not found");
		} 
		if (!user) {
			res.error(404, "user not found");
		}
		res.success(user);
	});
});

module.exports = users;