var Study = require('../../models/main.js').Study;
var Category = require('../../models/main.js').Category;

var imagesDelete = require('./__params.js').imagesDelete;
var imagesUpload = require('./__params.js').imagesUpload;
var filesUpload = require('./__params.js').filesUpload;
var filesDelete = require('./__params.js').filesDelete;

var path = require('path');
var shortid = require('shortid');
var async = require('async');
var del = require('del');

var __appdir = path.dirname(require.main.filename);


// ------------------------
// *** Admin Studys Block ***
// ------------------------


exports.list = function(req, res) {
	Study.where('type').equals('other').sort('-date').exec(function(err, studys) {
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

	async.series([
			async.apply(imagesUpload, study, post, files),
			async.apply(filesUpload, study, post, files)
		], function(results) {
		study.description_alt = post.description_alt;
		study.save(function(err, study) {
			res.send('ok');
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

		async.series([
			async.apply(imagesDelete, study, post, files),
			async.apply(imagesUpload, study, post, files),
			async.apply(filesDelete, study, post, files),
			async.apply(filesUpload, study, post, files)
		], function(results) {
			study.description_alt = post.description_alt;
			study.save(function(err, study) {
				res.send('ok');
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