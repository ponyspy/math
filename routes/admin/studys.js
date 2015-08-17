var Study = require('../../models/main.js').Study;
var Theme = require('../../models/main.js').Theme;
var Category = require('../../models/main.js').Category;
var shortid = require('shortid');


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
		res.render('auth/studys/', {studys: theme.studys, theme_id: req.params.id, sub_theme_id: req.params.sub_id});
	});
}


// ------------------------
// *** Add Studys Block ***
// ------------------------


exports.add = function(req, res) {
	var id = req.params.sub_id;
	Theme.findById(id).exec(function(err, theme) {
		Category.find().exec(function(err, categorys) {
			res.render('auth/studys/add.jade', {theme: theme, categorys: categorys});
		});
	});
}

exports.add_form = function(req, res) {
	var post = req.body;

	var study = new Study();

	study._short_id = shortid.generate();
	study.title = post.title;
	study.description = post.description;
	study.categorys = post.categorys == '' ? [] : post.categorys;
	study.status = post.status;
	study.video = post.video;

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
				res.render('auth/studys/edit.jade', {study: study, theme: theme, categorys: categorys});
			});
		});
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;
	var study_id = req.params.study_id;
	var theme_id = req.params.sub_id;

	Study.findById(study_id).exec(function(err, study) {

		study.title = post.title;
		study.description = post.description;
		study.categorys = post.categorys == '' ? [] : post.categorys;
		study.status = post.status;
		study.video = post.video;

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