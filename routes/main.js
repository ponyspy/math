var fs = require('fs');
var path = require('path');

var __appdir = path.dirname(require.main.filename);

exports.index = function(req, res) {
	var books = JSON.parse(fs.readFileSync(__appdir + '/views/main/books.json', 'utf8'));
	console.log(books)
	res.render('main', {books: books});
}