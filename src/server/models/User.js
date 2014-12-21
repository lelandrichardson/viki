var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	crypto = require('crypto'),
	VikiSchema = require('./VikiSchema');

var validateRequiredProperty = function (property) {
	return (property.length);
};

var validatePassword = function(password) {
	return (password && password.length > 6);
};

var UserSchema = new VikiSchema({
	username: {
		type: String,
		trim: true,
		default: '',
		validate: [validateRequiredProperty, 'Please fill in your username'],
		unique: true
	},
	password: {
		type: String,
		default: '',
		select: false,
		validate: [validatePassword, 'Password must be at least 6 characters']
	},
	salt: {
		type: String,
		select: false,
		default: ''
	},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		select: false,
		default: ['user']
	}
});

// Hook a pre save method to hash the password
UserSchema.pre('save', function(next) {

	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

// Create instance method for hashing a password
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

// Create instance method for authenticating user
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);

var User = mongoose.model('User');

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, '+password +salt', function(err, user) {
		if (err) { 
			return done(err); 
		}
		if (!user) { 
			return done(null, false, { message: 'Unknown user ' + username }); 
		}
		if (user.authenticate(password)) {
			return done(null, user);
		} else {
			return done(null, false, { message: 'Invalid password' });
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});