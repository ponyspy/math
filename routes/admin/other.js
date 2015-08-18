var Study = require('../../models/main.js').Study;
var Category = require('../../models/main.js').Category;
var shortid = require('shortid');


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

	var study = new Study();

	study.type = 'other';
	study._short_id = shortid.generate();
	study.title = post.title;
	study.description = post.description;
	study.categorys = post.categorys == '' ? [] : post.categorys;
	study.status = post.status;
	study.video = post.video;

	study.save(function(err, study) {
		res.redirect('back');
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