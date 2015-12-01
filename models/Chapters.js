var mongoose = require('mongoose');

var ChapterSchema = new mongoose.Schema({
  	title : String,
    description: String,
    link: String, // link to the item 
    guid: String, // optional - defaults to url 
    pubDate: String, // any format that js Date can parse.
    author: String,
    explicit: Boolean,
    subtitle: String,
    summary: String,
    duration: String,
    keywords: Array,
    enclosure: Object

});

mongoose.model('Chapter', ChapterSchema);