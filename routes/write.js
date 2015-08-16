var path = require('path');
var jade = require('jade');


var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	res.render('write');
}