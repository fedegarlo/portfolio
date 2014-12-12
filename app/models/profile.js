var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var profileSchema = mongoose.Schema({
  profile : {
		name : String,
		surname : String,
		email : String,
		password : String,
		phone : String,
		notes : String,
		owner : String,
		category : String,
		venue : String
  }
});

module.exports = mongoose.model('Profile', profileSchema);
