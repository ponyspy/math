var shortid = require('shortid');
var Category = require('../../models/main.js').Category;
var Study = require('../../models/main.js').Study;


// ------------------------
// *** Admin Categorys Block ***
// ------------------------


exports.list = function(req, res) {
  Category.find().sort('-date').exec(function(err, categorys) {
    res.render('auth/categorys/', {categorys: categorys});
  });
}


// ------------------------
// *** Add Categorys Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/categorys/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;

  var category = new Category();

  category._short_id = shortid.generate();
  category.title = post.title;
  category.status = post.status;

  category.save(function(err, category) {
    res.redirect('/auth/categorys');
  });
}


// ------------------------
// *** Edit Categorys Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {
    res.render('auth/categorys/edit.jade', {category: category});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {

    category.title = post.title;
    category.status = post.status;

    category.save(function(err, category) {
      res.redirect('/auth/categorys');
    });
  });
}


// ------------------------
// *** Remove Categorys Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  Category.findByIdAndRemove(id, function(err, category) {
    Study.update({'categorys': id}, {$pull: {categorys: id}}, {multi: true}).exec(function() {
      res.send('ok');
    });
  });
}