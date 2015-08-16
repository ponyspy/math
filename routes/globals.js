var async = require('async');

var Study = require('../models/main.js').Study;

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

	Study.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).exec(function(err, studys) {
		res.send(studys);
	});
}