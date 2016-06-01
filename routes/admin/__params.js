var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var jsdom = require('jsdom');
var gm = require('gm').subClass({ imageMagick: true });
var svgo = require('svgo');

var __appdir = path.dirname(require.main.filename);

module.exports.imagesUpload = function(study, post, files, callback) {
	if (files.images && files.images.length > 0) {
		var jquery = fs.readFileSync(__appdir + '/public/build/libs/js/jquery-2.1.4.min.js', 'utf-8');

		jsdom.env(post.description_alt, {src: [jquery]}, function(err, window) {
			var $ = window.$;
			var images = $('.image_upload').toArray();

			async.forEach(images, function(image, callback) {
				var $this = $(image);

				$this.removeAttr('class').removeAttr('height').css('max-width', $this.attr('width') + 'px').attr('width', '100%');

				var image_id = $this.attr('src');
				var file = files.images.filter(function(image) { return image.originalname == image_id; })[0];
				var file_name = file.originalname + '.' + mime.extension(file.mimetype);
				var dir_name = '/images/studys/' + study._id.toString();

				$this.attr('src', dir_name + '/' + file_name);

				mkdirp(__appdir + '/public' + dir_name, function() {
					if (mime.extension(file.mimetype) == 'svg') {
						var SVGO = new svgo();
						fs.readFile(file.path, function(err, data) {
							if (err) console.log(err);
							SVGO.optimize(data, function(result) {
								fs.writeFile(__appdir + '/public/' + dir_name + '/' + file_name, result.data, function(err) {
									if (err) console.log(err);
									callback();
								});
							});
						});
					} else {
						gm(file.path).size({bufferStream: true}, function(err, size) {
							if (err) console.log(err);
							this.resize(size.width > 600 ? 600 : false, false);
							this.quality(size.width > 600 ? 80 : 100);
							this.write(__appdir + '/public/' + dir_name + '/' + file_name, function(err) {
								if (err) console.log(err);
								callback();
							});
						});
					}
				});
			}, function() {
				post.description_alt = $('body').html();
				callback(null, 'images');
			});
		});
	} else {
		callback(null, false);
	}
};


module.exports.filesUpload = function(study, post, files, callback) {
	if (files.attach && files.attach.length > 0) {
		async.forEachOfSeries(files.attach, function(file, i, callback) {
			var dir_name = '/files/studys/' + study._id.toString();
			var file_name = Date.now() + '.' + mime.extension(file.mimetype);

			mkdirp(__appdir + '/public' + dir_name, function() {
				fs.rename(file.path, __appdir + '/public' + dir_name + '/' + file_name, function() {
					study.files.push({
						path: dir_name + '/' + file_name,
						desc: post.attach_desc[i] || ''
					});
					callback();
				});
			});
		}, function() {
			callback(null, 'files');
		});
	} else {
		callback(null, false);
	}
};

module.exports.filesDelete = function(study, post, files, callback) {
	if (post.files_delete && post.files_delete.length > 0) {
		async.forEachSeries(post.files_delete, function(path, callback) {
			del(__appdir + '/public' + path, function() {
				var num = study.files.map(function(e) { return e.path; }).indexOf(path);
				study.files.splice(num, 1);
				study.markModified('files');
				callback();
			});
		}, function() {
			callback(null, 'delete');
		});
	} else {
		callback(null, false);
	}
};