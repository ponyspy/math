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
var public_path = __appdir + '/public';
var preview_path = __appdir + '/public/preview/';


module.exports.imagesUpload = function(study, post, callback) {
	var jquery = fs.readFileSync(__appdir + '/public/build/libs/js/jquery-2.1.4.min.js', 'utf-8');
	var dir_name = '/images/studys/' + study._id.toString();

	del(public_path + dir_name, function(rm_path) {
		jsdom.env(post.description_alt, { src: [jquery] }, function(err, window) {
			var $ = window.$;
			var images = $('img').toArray();

			async.forEach(images, function(image, callback) {
				var $this = $(image);
				var file_name = path.basename($this.attr('src'));

				$this.removeAttr('width').removeAttr('height').removeAttr('alt');
				$this.attr('src', dir_name + '/' + file_name);

				mkdirp(public_path + dir_name, function() {
					fs.createReadStream(preview_path + file_name).pipe(fs.createWriteStream(public_path + dir_name + '/' + file_name));
					callback();
				});
			}, function() {
					study.description_alt = $('body').html();
					callback(null, study);
			});
		});
	});
};


module.exports.imagesPreview = function(study, callback) {
	if (!study.description_alt) return callback(null, study);

	var jquery = fs.readFileSync(__appdir + '/public/build/libs/js/jquery-2.1.4.min.js', 'utf-8');

	jsdom.env(study.description_alt, { src: [jquery] }, function(err, window) {
		var $ = window.$;
		var images = $('img').toArray();

		async.forEach(images, function(image, callback) {
			var $this = $(image);

			var file_path = $this.attr('src');
			var file_name = path.basename(file_path);

			fs.createReadStream(public_path + file_path).pipe(fs.createWriteStream(preview_path + file_name));

			$this.attr('src', '/preview/' + file_name);

			callback();
		}, function() {
				study.description_alt = $('body').html();
				callback(null, study);
		});
	});
};


module.exports.filesUpload = function(study, post, files, callback) {
	if (files.attach && files.attach.length > 0) {
		async.forEachOfSeries(files.attach, function(file, i, callback) {
			var dir_name = '/files/studys/' + study._id.toString();
			var file_name = Date.now() + '.' + mime.extension(file.mimetype);

			mkdirp(public_path + dir_name, function() {
				fs.rename(file.path, public_path + dir_name + '/' + file_name, function() {
					study.files.push({
						path: dir_name + '/' + file_name,
						desc: post.attach_desc[i] || ''
					});
					callback();
				});
			});
		}, function() {
			callback(null, 'files_upload');
		});
	} else {
		callback(null, false);
	}
};


module.exports.filesDelete = function(study, post, files, callback) {
	if (post.files_delete && post.files_delete.length > 0) {
		async.forEachSeries(post.files_delete, function(path, callback) {
			del(public_path + path, function() {
				var num = study.files.map(function(e) { return e.path; }).indexOf(path);
				study.files.splice(num, 1);
				study.markModified('files');
				callback();
			});
		}, function() {
			callback(null, 'files_delete');
		});
	} else {
		callback(null, false);
	}
};