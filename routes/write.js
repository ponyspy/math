var path = require('path');
var nodemailer = require('nodemailer');
var del = require('del');
var mime = require('mime');

var __appdir = path.dirname(require.main.filename);

transporter = nodemailer.createTransport({
	auth: {
		user: 'mailer@omnilingo.ru',
		pass: 'cer3000',
	},
	host: 'smtp.yandex.ru',
	port: '465',
	secure: true
});


exports.index = function(req, res) {
	res.render('write');
}

exports.mail = function(req, res) {
	var opts = {
		from: 'Робот omnilingo <mailer@omnilingo.ru>',
		replyTo: 'desade4me@gmail',  // req.body.email
		to: 'desade4me@gmail.com',
		subject: req.body.theme,
		text: req.body.description,
	}

	if (req.file) {
		opts.attachments= [{
			path: __appdir + '/' + req.file.path,
			filename: req.file.originalname
		}]
	}

	transporter.sendMail(opts, function(err, info) {
		del([__appdir + '/' + req.file.path], function() {
			res.redirect('/write');
		});
	});
}