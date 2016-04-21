var fs = require('fs');
var path = require('path');

var __appdir = path.dirname(require.main.filename);

exports.index = function(req, res) {
	try {
		var books = JSON.parse(fs.readFileSync(__appdir + '/views/main/books.json'));
	} catch(e) {
		var books = [];
	}
	res.render('main', {books: books});
}