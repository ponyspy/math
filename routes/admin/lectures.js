var Study = require('../../models/main.js').Study;
var Theme = require('../../models/main.js').Theme;
var Category = require('../../models/main.js').Category;

var shortid = require('shortid');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var __appdir = path.dirname(require.main.filename);


// ------------------------
// *** Handlers Block ***
// ------------------------


var move = function (array, from, to) {
	if( to === from ) return;

	var target = array[from];
	var increment = to < from ? -1 : 1;

	for(var k = from; k != to; k += increment) {
		array[k] = array[k + increment];
	}
	array[to] = target;
}



// ------------------------
// *** Admin Studys Block ***
// ------------------------


exports.list = function(req, res) {
	Theme.findById(req.params.sub_id).populate('studys').exec(function(err, theme) {
		res.render('auth/lectures/', {studys: theme.studys, theme_id: req.params.id, sub_theme_id: req.params.sub_id});
	});
}


// ------------------------
// *** Add Studys Block ***
// ------------------------


exports.add = function(req, res) {
	var id = req.params.sub_id;
	Theme.findById(id).exec(function(err, theme) {
		Category.find().exec(function(err, categorys) {
			res.render('auth/lectures/add.jade', {theme: theme, categorys: categorys});
		});
	});
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	var study = new Study();

	study._short_id = shortid.generate();
	study.title = post.title;
	study.description = post.description;
	study.categorys = post.categorys == '' ? [] : post.categorys;
	study.status = post.status;
	study.video = post.video;


	async.series({
		filesUpload: function(callback) {
			if (files.attach && files.attach.length > 0) {
				async.forEachOfSeries(files.attach, function(file, i, callback) {
					var dir_name = '/files/studys/' + study._id.toString();
					var file_name = Date.now() + '.' + mime.extension(file.mimetype);

					mkdirp(__appdir + '/public' + dir_name, function() {
						fs.rename(__appdir + '/' + file.path, __appdir + '/public' + dir_name + '/' + file_name, function() {
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
			Theme.findById(req.params.sub_id).exec(function(err, theme) {
				if (theme.studys.length == +post.order) {
					theme.studys.push(study._id);
				} else {
					theme.studys.splice(post.order, 0, study._id);
				}

				theme.save(function(err, theme) {
					res.redirect('/auth/themes/' + req.params.id + '/sub/edit/' + req.params.sub_id + '/studys/');
				});
			});
		});
	});
}


// ------------------------
// *** Edit Studys Block ***
// ------------------------


exports.edit = function(req, res) {
	var study_id = req.params.study_id;
	var theme_id = req.params.sub_id;

	Theme.findById(theme_id).exec(function(err, theme) {
		Study.findById(study_id).exec(function(err, study) {
			Category.find().exec(function(err, categorys) {
				res.render('auth/lectures/edit.jade', {study: study, theme: theme, categorys: categorys});
			});
		});
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var study_id = req.params.study_id;
	var theme_id = req.params.sub_id;

	Study.findById(study_id).exec(function(err, study) {

		study.title = post.title;
		study.description = post.description;
		study.categorys = post.categorys == '' ? [] : post.categorys;
		study.status = post.status;
		study.video = post.video;


		async.series({
			filesDelete: function(callback) {
				if (post.files_delete && post.files_delete.length > 0) {
					async.forEachSeries(post.files_delete, function(num, callback) {
						del([study.files[num].path], function() {
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
							fs.rename(__appdir + '/' + file.path, __appdir + '/public' + dir_name + '/' + file_name, function() {
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
				Theme.findById(theme_id).exec(function(err, theme) {
					var current_index = theme.studys.indexOf(study._id);
					move(theme.studys, current_index, post.order);
					theme.markModified('studys');
					theme.save(function(err, theme) {
						res.redirect('/auth/themes/' + req.params.id + '/sub/edit/' + req.params.sub_id + '/studys/');
					});
				});
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
		res.send('ok');
	});
}