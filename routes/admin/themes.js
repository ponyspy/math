var Theme = require('../../models/main.js').Theme;


// ------------------------
// *** Admin Themes Block ***
// ------------------------


exports.list = function(req, res) {
  Theme.find().where('parent').exists(false).exec(function(err, themes) {
    res.render('auth/themes', {themes: themes});
  });
}

exports.list_sub = function(req, res) {
  var id = req.params.id;
  Theme.findById(id).populate('sub').exec(function(err, theme) {
    res.render('auth/themes/index_sub.jade', {theme: theme});
  });
}


// ------------------------
// *** Add Themes Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/themes/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;

  var theme = new Theme();

  theme.title = post.title;
  theme.sym = post.sym ? post.sym : undefined;


  if (req.params.id) {
    theme.parent = req.params.id;
    theme.save(function(err, theme) {
      if (err) {console.log(err)};
      Theme.findById(req.params.id).exec(function(err, parent_theme) {
        parent_theme.sub.push(theme._id);
        parent_theme.save(function(err, parent_theme) {
          res.redirect('/auth/themes/' + parent_theme._id + '/sub');
        });
      });
    });
  } else {
    theme.save(function(err, theme) {
      res.redirect('/auth/themes');
    });
  }
}


// ------------------------
// *** Edit Themes Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.sub_id
    ? req.params.sub_id
    : req.params.id;

  Theme.findById(id).exec(function(err, theme) {
    res.render('auth/themes/edit.jade', {theme: theme});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.sub_id
    ? req.params.sub_id
    : req.params.id;

  Theme.findById(id).exec(function(err, theme) {

    theme.title = post.title;
    theme.sym = post.sym ? post.sym : undefined;

    theme.save(function(err, theme) {
      if (req.params.sub_id) {
        res.redirect('/auth/themes/' + req.params.id + '/sub');
      } else {
        res.redirect('/auth/themes');
      }
    });
  });
}


// ------------------------
// *** Remove Theme Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;
  Theme.findByIdAndRemove(id, function() {
    res.send('ok');
  });
}