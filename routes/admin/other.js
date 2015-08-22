var Study = require('../../models/main.js').Study;
var Category = require('../../models/main.js').Category;

var shortid = require('shortid');
var mkdirp = require('mkdirp');
var del = require('del');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var fs = require('fs');
var path = require('path');

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
	// console.log(files.image)

	// console.log(files.attach)
	// console.log(post.attach_desc)

	async.parallel({
		imageUpload: function(callback) {
			callback(null, 'image');
		},
		filesUpload: function(callback) {
			if (files.attach && files.attach.length > 0) {
				async.forEachOfSeries(files.attach, function(file, i, callback) {
					var dir_name = '/files/studys/' + study._id.toString();
					var file_name = Date.now() + '.' + file.extension;

					mkdirp(__appdir + '/public' + dir_name, function() {
						fs.rename(file.path, __appdir + '/public' + dir_name + '/' + file_name, function() {
							study.files.push({
								path: '/public' + dir_name + '/' + file_name,
								desc: post.attach_desc[i]
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
	var id = req.params.id;

	Study.findById(id).exec(function(err, study) {

		study.title = post.title;
		study.description = post.description;
		study.categorys = post.categorys == '' ? [] : post.categorys;
		study.status = post.status;
		study.video = post.video;

		study.save(function(err, study) {
			res.redirect('back');
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