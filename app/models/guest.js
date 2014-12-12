var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var guestSchema = mongoose.Schema({
    guest : {
    	name     :String
    }
});

module.exports = mongoose.model('Guest', guestSchema);
