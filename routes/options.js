var path = require('path');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var mime = require('mime');
var svgo = require('svgo');
var del = require('del');

var __appdir = path.dirname(require.main.filename);


exports.backup = function(req, res) {
	res.sendFile('backup.tar', {root: __appdir});
};

exports.preview = function(req, res) {
	var file = req.file;
	var file_name = Date.now();

	if (mime.extension(file.mimetype) == 'svg') {
		var SVGO = new svgo({ plugins: [{ convertShapeToPath: false }] });
		var new_path = '/preview/' + file_name + '.svg';

		fs.readFile(file.path, function(err, data) {
			SVGO.optimize(data, function(result) {
				fs.writeFile(__appdir + '/public' + new_path, result.data, function(err) {
					del(file.path, function() {
						res.send(new_path);
					});
				});
			});
		});
	} else if (/jpeg|png|gif/.test(mime.extension(file.mimetype))) {
		gm(file.path).identify({ bufferStream: true }, function(err, meta) {
			var new_path = mime.extension(file.mimetype) == 'gif'
				? '/preview/' + file_name + '.gif'
				: '/preview/' + file_name + '.' + ((meta['Channel depth'].Alpha || meta['Channel statistics'].Alpha || meta.Alpha) ? 'png' : 'jpg');

			this.resize(meta.size.width > 600 ? 600 : false, false);
			this.quality(meta.size.width >= 600 ? 82 : 100);
			this.write(__appdir + '/public' + new_path, function (err) {
				del(file.path, function() {
					res.send(new_path);
				});
			});
		});
	}
};