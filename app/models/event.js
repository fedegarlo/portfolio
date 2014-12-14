var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var eventSchema = mongoose.Schema({
  event : {
		name : String,
		owner : String
  }
});

module.exports = mongoose.model('Event', eventSchema);
