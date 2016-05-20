var path = require('path');
var fs = require('fs');

var __appdir = path.dirname(require.main.filename);


exports.backup = function(req, res) {
	res.sendFile('backup.tar', {root: __appdir});
}