var path = require('path');
var fs = require('fs');

var __appdir = path.dirname(require.main.filename);


// ------------------------
// *** Admin Books Block ***
// ------------------------


exports.edit = function(req, res) {
  fs.readFile(__appdir + '/books.json', function(err, books) {
    res.render('auth/books/index.jade', {books: books});
  });
}

exports.edit_form = function(req, res) {
  var books = req.body.books;

  fs.writeFile(__appdir + '/books.json', books, function(err) {
    res.redirect('back');
  });
}