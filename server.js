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

app.get('/tag/:tag_name', exports.tagsearch);

app.get('/', function(request, response) {
    response.render('index.html');
});

server.listen(port, ipaddress);
console.log('Listening  to  port ' + port);

