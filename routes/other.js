var path = require('path');
var jade = require('jade');

var Study = require('../models/main.js').Study;
var Category = require('../models/main.js').Category;

var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	Study.where('type').equals('other').sort('date').limit(20).exec(function(err, studys) {
		Category.where('status').equals('other').exec(function(err, categorys) {
			res.render('other', {studys: studys, categorys: categorys});
		});
	});
}

exports.other_item = function(req, res) {
	var id = req.params.id;

	Category.find().exec(function(err, categorys) {
		Study.findOne({'_short_id': id}).exec(function(err, study) {
			res.render('other/study.jade', {study: study, categorys: categorys});
		});
	});
}


exports.get_items = function(req, res) {

}