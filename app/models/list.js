var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var listSchema = mongoose.Schema({
  list : {
		name : String,
		owner : String
  }
});

module.exports = mongoose.model('List', listSchema);
