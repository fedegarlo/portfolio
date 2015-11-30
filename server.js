#!/bin/env node
//  OpenShift sample Node application

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var express = require('express');
var fs      = require('fs');

var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var path = require('path'),
    fs = require('fs');
var http = require('http');
var api = require('instagram-node').instagram();
var server = http.createServer(app);

api.use({
  client_id: '5c45535025534f8fa3e56bbed0892b78',
  client_secret: 'c7e2b49f5b574d3a9df97f944c5fa92b'
});


var configDB = require('./config/database.js');

//mongoose.connect(configDB.url); 

app.configure(function() {

    app.use(express.cookieParser());
    app.use(express.bodyParser()); 
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.use(express.session({ secret: 'fedegarlo' })); 
    app.use(express.bodyParser({uploadDir:'/images'}));
    app.use(flash()); 

});

exports.tagsearch = function(req, res) {
    if (req.params.tag_name) {
        api.tag_media_recent(req.params.tag_name, function(err, result, remaining, limit) {
            res.send(result);
        });
    } else {
        res.status(404).send('Not found');
    }
};

exports.macfoolsRss = function(req, res) {
var Podcast = require('podcast');
 
/* lets create an rss feed */
var feed = new Podcast({
    title: 'Macfools',
    description: 'Mezclamos tecnología, desarrollo de software, videojuegos y algún otro tema que se nos ocurra. Empezamos de nuevo cada programa y no te lo puedes perder.',
    feed_url: 'http://www.fedegarlo.com/rss/macfools',
    site_url: 'http://www.fedegarlo.com',
    image_url: 'http://nodejs-fedegarlo.rhcloud.com/sites/macfools/podcast/cover.png',
    docs: 'http://www.fedegarlo.com',
    author: 'Fede Garcia',
    managingEditor: 'Fede Garcia',
    webMaster: 'Fede Garcia',
    copyright: '2015 Fede Garcia',
    language: 'es',
    ttl: '60',
    itunesAuthor: 'Fede Garcia',
    itunesSubtitle: 'Todo sobre tecnología contado de manera natural.',
    itunesOwner: { name: 'Fede Garcia', email:'fedegarcia@icloud.com' },
    itunesExplicit: false,
    itunesCategory: [{
      text: 'Technology',
      subcats: [{
        text: 'Computers'
      }]
    }],
    itunesImage: 'http://nodejs-fedegarlo.rhcloud.com/sites/macfools/podcast/cover.png'
});
var posts = [{title:'uno'},{title:'dos'}];
for(var key in posts) {
    feed.item({
        title:  posts[key].title,
        description: 'use this for the content. It can include html.',
        url: 'http://example.com/article4?this&that', // link to the item 
        guid: '1123', // optional - defaults to url 
        categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories 
        author: 'Guest Author', // optional - defaults to feed author property 
        date: 'May 27, 2012', // any format that js Date can parse. 
        lat: 33.417974, //optional latitude field for GeoRSS 
        long: -111.933231, //optional longitude field for GeoRSS 
        itunesAuthor: 'Max Nowack',
        itunesExplicit: false,
        itunesSubtitle: 'I am a sub title',
        itunesSummary: 'I am a summary',
        itunesDuration: 12345,
        itunesKeywords: ['javascript','podcast']
    });
};
var xml = feed.xml();

    res.set('Content-Type', 'text/xml');
    res.send(xml);

};

app.get('/tag/:tag_name', exports.tagsearch);
app.get('/rss/macfools', exports.macfoolsRss);

app.get('/', function(request, response) {
    response.render('index.html');
});

server.listen(port, ipaddress);
console.log('Listening  to  port ' + port);

