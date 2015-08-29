var Theme = require('../../models/main.js').Theme;
var Study = require('../../models/main.js').Study;

var path = require('path');
var shortid = require('shortid');
var del = require('del');
var async = require('async');

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
// *** Admin Themes Block ***
// ------------------------


exports.list = function(req, res) {
  var id = req.params.id;

  Theme.findById(id).populate('sub').exec(function(err, theme) {
    res.render('auth/themes/sub/index.jade', {theme: theme});
  });
}


// ------------------------
// *** Add Themes Block ***
// ------------------------


exports.add = function(req, res) {
  var parent_id = req.params.id;

  Theme.findById(parent_id).exec(function(err, parent_theme) {
    res.render('auth/themes/sub/add.jade', {parent_theme: parent_theme});
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var parent_id = req.params.id;

  var theme = new Theme();

  theme.title = post.title;
  theme.description = post.description;
  theme.parent = parent_id;
  theme.overlay = post.overlay != '' ? post.overlay : undefined;
  theme._short_id = shortid.generate();

  theme.save(function(err, theme) {
    Theme.findById(parent_id).exec(function(err, parent_theme) {

      if (parent_theme.sub.length == +post.order) {
        parent_theme.sub.push(theme._id);
      } else {
        parent_theme.sub.splice(post.order, 0, theme._id);
      }
      parent_theme.save(function(err, parent_theme) {
        res.redirect('/auth/themes/' + parent_theme._id + '/sub');
      });
    });
  });
}


// ------------------------
// *** Edit Themes Block ***
// ------------------------


exports.edit = function(req, res) {
  var parent_id = req.params.id;
  var sub_id = req.params.sub_id;

  Theme.findById(sub_id).exec(function(err, theme) {
    Theme.findById(parent_id).exec(function(err, parent_theme) {
      res.render('auth/themes/sub/edit.jade', {theme: theme, parent_theme: parent_theme});
    });
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var parent_id = req.params.id;
  var sub_id = req.params.sub_id;

  Theme.findById(sub_id).exec(function(err, theme) {

    theme.title = post.title;
    theme.description = post.description;
    theme.overlay = post.overlay != '' ? post.overlay : undefined;

    theme.save(function(err, theme) {
      Theme.findById(parent_id).exec(function(err, parent_theme) {
        var current_index = parent_theme.sub.indexOf(theme._id);
        move(parent_theme.sub, current_index, post.order);
        parent_theme.markModified('sub');
        parent_theme.save(function() {
          res.redirect('/auth/themes/' + parent_id + '/sub');
        });
      });
    });
  });
}


// ------------------------
// *** Remove Theme Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  Theme.findByIdAndRemove(id, function(err, theme) {
    Theme.update({'sub': id}, {$pull: {sub: id}}, {multi: true}).exec(function() {
      Study.remove({$in: theme.studys}).exec(function() {
        async.forEachSeries(theme.studys, function(study, callback) {
          del([__appdir + '/public/images/studys/' + study, __appdir + '/public/files/studys/' + study], function() {
            callback();
          });
        }, function() {
          res.send('ok');
        });
      });
    });
  });
}