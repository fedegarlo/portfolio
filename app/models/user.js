var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    user : {
		username :String,
		name : String,
		surname : String,
    email : String,
    password : String,
		phone : String,
		address : String,
		owner : String,
		admin : Boolean,
		category : String,
		notes : String,
		venue : String
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.user.password);
};

userSchema.methods.verifyAdmin = function() {
    return this.user.admin;
};

userSchema.methods.updateUser = function(request, response){

	this.user.name = request.body.name;
	this.user.address = request.body.address;
	 this.user.save();
	response.redirect('/user');
};



module.exports = mongoose.model('User', userSchema);
