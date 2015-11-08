var path = require('path');
var jade = require('jade');

var Study = require('../models/main.js').Study;
var Category = require('../models/main.js').Category;

var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	Category.where('status').equals('other').exec(function(err, categorys) {
		res.render('other', {categorys: categorys});
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
	var post = req.body;
	var Query = post.context.category == 'all'
		? Study.find({'type': 'other'})
		: Study.find({'type': 'other', 'categorys': post.context.category});

	Query.sort('-date').skip(post.context.skip).limit(post.context.limit).exec(function(err, studys) {
		console.log(post)
		if (studys.length > 0) {
			var opts = {studys: studys, host: req.hostname, compileDebug: false, debug: false, cache: true, pretty: false};
			res.send(jade.renderFile(__appdir + '/views/other/get_studys.jade', opts));
		} else {
			res.send('end');
		}
	});
}