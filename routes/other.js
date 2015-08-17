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


exports.get_items = function(req, res) {

}