var mongoose = require('mongoose'),
		mongooseBcrypt = require('mongoose-bcrypt'),
		Schema = mongoose.Schema;


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: { type: String, default: 'User' },
	date: { type: Date, default: Date.now },
});

var themeSchema = new Schema({
	title: { type: String, trim: true },
	description: { type: String, trim: true },
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	overlay: { type: String, trim: true },
	numbering: {
		offset: Number,
		start: Number
	},
	parent: { type: Schema.Types.ObjectId, ref: 'Theme' },
	sub: [{ type: Schema.Types.ObjectId, ref: 'Theme' }],
	studys: [{ type: Schema.Types.ObjectId, ref: 'Study' }],
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var studySchema = new Schema({
	title: { type: String, trim: true },
	description: { type: String, trim: true },
	description_alt: { type: String, trim: true },
	type: { type: String, default: 'lectures' },
	categorys: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	status: String,
	files: [{
		path: String,
		desc: String
	}],
	image: String,
	video: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var categorySchema = new Schema({
	title: { type: String, trim: true },
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: {type: Date, default: Date.now},
});

studySchema.index({'title': 'text', 'description': 'text'}, {default_language: 'russian', weights: {title: 2, description: 1 }});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Study = mongoose.model('Study', studySchema);
module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.Theme = mongoose.model('Theme', themeSchema);
