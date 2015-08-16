var path = require('path');
var jade = require('jade');

var Event = require('../models/main.js').Event;
var News = require('../models/main.js').News;
var Category = require('../models/main.js').Category;

var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	res.render('other');
}


exports.get_items = function(req, res) {

}