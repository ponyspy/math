var Theme = require('../../models/main.js').Theme;
var Study = require('../../models/main.js').Study;

var path = require('path');
var async = require('async');
var del = require('del');
var shortid = require('shortid');

var __appdir = path.dirname(require.main.filename);


// ------------------------
// *** Admin Themes Block ***
// ------------------------


exports.list = function(req, res) {
  Theme.find().where('parent').exists(false).exec(function(err, themes) {
    res.render('auth/themes/main/index.jade', {themes: themes});
  });
}


// ------------------------
// *** Add Themes Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/themes/main/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;

  var theme = new Theme();

  theme.title = post.title;
  theme.sym = post.sym ? post.sym : shortid.generate();
  theme.numbering = post.numbering;

  theme.save(function(err, theme) {
    res.redirect('/auth/themes');
  });
}


// ------------------------
// *** Edit Themes Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Theme.findById(id).exec(function(err, theme) {
    res.render('auth/themes/main/edit.jade', {theme: theme});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Theme.findById(id).exec(function(err, theme) {

    theme.title = post.title;
    if (post.sym && post.sym != theme.sym) {
      theme.sym = post.sym
    }
    theme.numbering = post.numbering;

    theme.save(function(err, theme) {
      res.redirect('/auth/themes');
    });
  });
}


// ------------------------
// *** Remove Theme Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  Theme.findByIdAndRemove(id).exec(function(err, theme) {
    Theme.find({'parent': id}).populate('studys').exec(function(err, themes_sub) {
      Theme.remove({'parent': id}, function(err) {
        async.forEachSeries(themes_sub, function(theme_sub, callback) {
          async.forEachSeries(theme_sub.studys, function(study, callback) {
            Study.findByIdAndRemove(study._id).exec(function() {
              del([__appdir + '/public/images/studys/' + study._id.toString(), __appdir + '/public/files/studys/' + study._id.toString()], function() {
                callback();
              });
            });
          }, callback);
        }, function() {
          res.send('ok');
        });
      });
    });
  });
}