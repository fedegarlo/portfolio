var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var venueSchema = mongoose.Schema({
  venue : {
		name : String,
		address : String,
		city : String,
		phone : String,
		notes : String,
		owner : String
  }
});

module.exports = mongoose.model('Venue', venueSchema);
