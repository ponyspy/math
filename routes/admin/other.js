var Study = require('../../models/main.js').Study;
var Category = require('../../models/main.js').Category;

var shortid = require('shortid');
var mkdirp = require('mkdirp');
var del = require('del');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var __appdir = path.dirname(require.main.filename);


// ------------------------
// *** Admin Studys Block ***
// ------------------------


exports.list = function(req, res) {
	Study.where('type').equals('other').exec(function(err, studys) {
		res.render('auth/other/', {studys: studys});
	});
}


// ------------------------
// *** Add Studys Block ***
// ------------------------


exports.add = function(req, res) {
	Category.find().exec(function(err, categorys) {
		res.render('auth/other/add.jade', {categorys: categorys});
	});
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	var study = new Study();

	study.type = 'other';
	study._short_id = shortid.generate();
	study.title = post.title;
	study.description = post.description;
	study.categorys = post.categorys == '' ? [] : post.categorys;
	study.status = post.status;
	study.video = post.video;

	async.series({
		imageUpload: function(callback) {
			if (files.image && files.image.length > 0) {
				var dir_name = '/images/studys/' + study._id.toString();
				var file_name = Date.now() + '.' + mime.extension(files.image[0].mimetype);

				mkdirp(__appdir + '/public' + dir_name, function() {
					gm(files.image[0].path).resize(720, false).quality(100).write(__appdir + '/public' + dir_name + '/' + file_name, function() {
						study.image = dir_name + '/' + file_name;
						callback(null, 'image');
					});
				});
			} else {
				callback(null, false);
			}
		},
		filesUpload: function(callback) {
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
		}
	}, function(results) {
		study.save(function(err, study) {
			res.redirect('back');
		});
	});
}


// ------------------------
// *** Edit Studys Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.id;

	Study.findById(id).exec(function(err, study) {
		Category.find().exec(function(err, categorys) {
			res.render('auth/other/edit.jade', {study: study, categorys: categorys});
		});
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var id = req.params.id;

	Study.findById(id).exec(function(err, study) {

		study.title = post.title;
		study.description = post.description;
		study.categorys = post.categorys == '' ? [] : post.categorys;
		study.status = post.status;
		study.video = post.video;

		async.series({
			imageUpload: function(callback) {
				if (files.image && files.image.length > 0) {
					var dir_name = '/images/studys/' + study._id.toString();
					var file_name = Date.now() + '.' + mime.extension(files.image[0].mimetype);

					mkdirp(__appdir + '/public' + dir_name, function() {
						gm(files.image[0].path).resize(720, false).quality(100).write(__appdir + '/public' + dir_name + '/' + file_name, function() {
							study.image = dir_name + '/' + file_name;
							callback(null, 'image');
						});
					});
				} else {
					callback(null, false);
				}
			},
			filesDelete: function(callback) {
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
			},
			filesUpload: function(callback) {
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
			}
		}, function(results) {
			study.save(function(err, study) {
				res.redirect('back');
			});
		});
	});
}


// ------------------------
// *** Remove Studys Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Study.findByIdAndRemove(id, function() {
		del([__appdir + '/public/images/studys/' + id, __appdir + '/public/files/studys/' + id], function() {
			res.send('ok');
		});
	});
}