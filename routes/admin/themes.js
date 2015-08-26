var Theme = require('../../models/main.js').Theme;


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
  theme.sym = post.sym ? post.sym : undefined;
  theme.numbering = post.numbering;

  theme.save(function(err, theme) {
    res.redirect('/auth/themes');
  });
}


// ------------------------
// *** Edit Themes Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.sub_id
    ? req.params.sub_id
    : req.params.id;

  Theme.findById(id).exec(function(err, theme) {
    res.render('auth/themes/main/edit.jade', {theme: theme});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Theme.findById(id).exec(function(err, theme) {

    theme.title = post.title;
    theme.sym = post.sym ? post.sym : undefined;
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
  Theme.findByIdAndRemove(id, function() {
    Theme.remove({'parent': id}, function() {
      res.send('ok');
    })
  });
}