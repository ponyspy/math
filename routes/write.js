var path = require('path');
var nodemailer = require('nodemailer');
var del = require('del');
var mime = require('mime');

var __appdir = path.dirname(require.main.filename);

transporter = nodemailer.createTransport({
	auth: {
		user: 'mailer@oschool.ru',
		pass: 'pwl4511',
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
		from: 'Робот oschool <mailer@oschool.ru>',
		replyTo: req.body.email,
		to: 'inbox@oschool.ru',
		subject: req.body.theme,
		text: req.body.description,
	}

	if (req.file) {
		opts.attachments= [{
			path: req.file.path,
			filename: req.file.originalname
		}]
	}

	transporter.sendMail(opts, function(err, info) {
		if (!req.file) return res.redirect('/write');
		del([req.file.path], function() {
			res.redirect('/write#send');
		});
	});
}