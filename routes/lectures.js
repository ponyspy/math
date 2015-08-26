var path = require('path');
var jade = require('jade');

var Theme = require('../models/main.js').Theme;
var Study = require('../models/main.js').Study;

var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	var sub_num = +req.params.sub_num;
	var sym = req.params.theme_sym;

	Theme.where('sym').equals(sym).select('title sub sym numbering').exec(function(err, current_theme) {
		if (current_theme.length == 0 || current_theme[0].sub.length == 0) return res.status(500).render('error', {status: 500});
		else if (current_theme.length == 0 || !Number.isInteger(sub_num) || current_theme[0].sub.length - 1 < sub_num) return res.redirect('/lectures');
		Theme.populate(current_theme, {path: 'sub'}, function(err, current_theme) {
			var studys = (current_theme[0].sub[sub_num] && current_theme[0].sub[sub_num].studys) || [];

			Study.where('_id').in(studys).exec(function(err, studys) {
				Theme.where('parent').exists(false).select('title sym').exec(function(err, themes) {
					res.render('lectures', {themes: themes, current_theme: current_theme[0], studys: studys, sub_num: sub_num});
				});
			});
		});
	});
}

exports.lecture = function(req, res) {
	var id = req.params.id;

	Study.findOne({'_short_id': id}).exec(function(err, study) {
		if (!study) return res.redirect('/lectures');
		Theme.findOne({studys: study._id}).select('title parent').exec(function(err, theme_sub) {
			Theme.findById(theme_sub.parent).populate({path: 'sub', select: 'title overlay'}).select('sym sub').exec(function(err, theme_parent) {
				Theme.where('parent').exists(false).select('title sym').exec(function(err, themes) {
					res.render('lectures/study.jade', {study: study, theme_sub: theme_sub, theme_parent: theme_parent, themes: themes});
				});
			});
		});
	});
}

exports.redirect = function(req, res) {
	Theme.where('parent').exists(false).sort('date').select('sym').exec(function(err, themes) {
		if (themes.length == 0) return res.status(500).render('error', {status: 500});
		res.redirect('/lectures/' + themes[0].sym + '/' + 0)
	});
}