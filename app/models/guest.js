var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var guestSchema = mongoose.Schema({
    guest : {
	    name     :String,
			surname:String,
			phone :String,
			email :String,
			genre :String,
			category :String,
			list :String,
			companion :String,
			notes :String,
			owner :String
		}
	});

module.exports = mongoose.model('Guest', guestSchema);
