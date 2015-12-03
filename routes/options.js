var path = require('path');

var __appdir = path.dirname(require.main.filename);

exports.backup = function(req, res) {
	res.sendFile('backup.tar', {root: __appdir});
}