var path = require('path');
var fs = require('fs');
var mime = require('mime');
var gm = require('gm').subClass({ imageMagick: true });

var __appdir = path.dirname(require.main.filename);

var decodeBase64Image = function(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
			response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}


exports.backup = function(req, res) {
	res.sendFile('backup.tar', {root: __appdir});
}

exports.images = function(req, res) {
 	var file = decodeBase64Image(req.body.base64);
 	var name = Date.now() + '.' + mime.extension(file.type);

 	// gm(buffer).write(__appdir + '/out.png', function() {
 	// 	res.send('cool');
 	// });

 	fs.writeFile(__appdir + '/public/preview/' + name, file.data, 'binary', function(err) {
 		res.send('/preview/' + name);
 	});
}