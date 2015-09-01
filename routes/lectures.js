var path = require('path');
var jade = require('jade');

var Theme = require('../models/main.js').Theme;
var Study = require('../models/main.js').Study;

var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	var sub_id = req.params.sub_id;
	var sym = req.params.theme_sym;

	Theme.findOne({'sym': sym}).select('title sub sym numbering').exec(function(err, current_theme) {
		if (!current_theme || current_theme.sub.length == 0) return res.status(500).render('error', {status: 500});
		Theme.populate(current_theme, {path: 'sub'}, function(err, current_theme) {
			var current_sub = current_theme.sub.filter(function(theme_sub) { return theme_sub._short_id == sub_id })[0];
			if (!current_sub) return res.status(500).render('error', {status: 500});
			var sub_num = current_theme.sub.map(function(e) { return e._short_id; }).indexOf(sub_id);

			Study.where('_id').in(current_sub.studys).exec(function(err, studys) {
				Theme.where('parent').exists(false).select('title sym').exec(function(err, themes) {
					res.render('lectures', {themes: themes, current_theme: current_theme, studys: studys, sub_num: sub_num, current_sub: current_sub});
				});
			});
		});
	});
}

exports.lecture = function(req, res) {
	var id = req.params.id;

	Study.findOne({'_short_id': id}).exec(function(err, study) {
		if (!study) return res.status(500).render('error', {status: 500});
		Theme.findOne({studys: study._id}).select('title parent').exec(function(err, theme_sub) {
			Theme.findById(theme_sub.parent).populate({path: 'sub', select: 'title overlay _short_id'}).select('sym sub numbering').exec(function(err, theme_parent) {
				Theme.where('parent').exists(false).select('title sym').exec(function(err, themes) {
					res.render('lectures/study.jade', {study: study, theme_sub: theme_sub, theme_parent: theme_parent, themes: themes});
				});
			});
		});
	});
}

exports.redirect = function(req, res) {
	Theme.where('parent').exists(false).sort('date').select('sym sub').exec(function(err, themes) {
		if (themes.length == 0) return res.status(500).render('error', {status: 500});
		Theme.populate(themes[0], {path: 'sub'}, function(err, theme) {
			Theme.findOne({'_id': theme.sub[0]._id}).exec(function(err, sub_theme) {
				if (!sub_theme) return res.status(500).render('error', {status: 500});
				res.redirect('/lectures/' + theme.sym + '/' + sub_theme._short_id);
			});
		});
	});
}

exports.redirect_sym = function(req, res) {
	var sym = req.params.theme_sym;

	Theme.findOne({sym: sym}).exec(function(err, theme) {
		Theme.populate(theme, {path: 'sub'}, function(err, theme) {
			if (theme.sub.length == 0) return res.status(500).render('error', {status: 500});
			res.redirect('/lectures/' + theme.sym + '/' + theme.sub[0]._short_id);
		});
	});
}