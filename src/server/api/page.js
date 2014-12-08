var express = require('express');
var mongoose = require('mongoose');
var Page = mongoose.model('Page');

var pages = express.Router();

pages.get('/:id', function(req, res) {
	var id = req.param('id');
	Page.findById(id).populate('createdBy').lean().exec(function(err, page) {
		if (err) {
			res.error(404, "page not found");
		} 
		if (!page) {
			res.error(404, "page not found");
		}
		res.success(page);
	});
});

pages.put('/', function(req, res) {
	var page = new Page(req.body);

	page.createdBy = req.user;

	page.save(function(err) {
		if (err) {
			return res.error(400, err);
		}
		res.success(page);
	});
});

module.exports = pages;