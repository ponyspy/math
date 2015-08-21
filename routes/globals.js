var path = require('path');
var async = require('async');
var jade = require('jade');

var Study = require('../models/main.js').Study;
var Category = require('../models/main.js').Category;

var __appdir = path.dirname(require.main.filename);

function searchNormalize(search) {
	var words = search.split(' ');
	var result = [];

	for (var i = words.length - 1; i >= 0; i--) {
		var lower =  words[i].toLowerCase();
		var upper = lower.replace(lower.charAt(0), lower.charAt(0).toUpperCase());
		result.push(lower);
		result.push(upper);
	};

	return result.join('||');
}

exports.search = function(req, res) {
	var search = searchNormalize(req.body.search);

	Study.distinct('categorys', { $text: { $search: search } }).exec(function(err, categorys) {
		Category.where('_id').in(categorys).select('title _id').exec(function(err, categorys) {
			Study.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).exec(function(err, studys) {
				var opts = {studys: studys, compileDebug: false, debug: false, cache: true, pretty: false};
				var html = jade.renderFile(__appdir + '/views/other/get_studys.jade', opts);
				res.send({studys: html, categorys: categorys});
			});
		});
	});
}