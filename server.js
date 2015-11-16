#!/bin/env node
//  OpenShift sample Node application

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var express = require('express');
var fs      = require('fs');

var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
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

require('./config/passport')(passport); 

app.configure(function() {

    app.use(express.cookieParser());
    app.use(express.bodyParser()); 
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.use(express.session({ secret: 'fedegarlo' })); 
    app.use(express.bodyParser({uploadDir:'/images'}));
    app.use(passport.initialize());
    app.use(passport.session()); 
    app.use(flash()); 

});

exports.anayfede = function(req, res) {
    api.tag_media_recent('anayfede', function(err, result, remaining, limit) {
        res.send(result);
    });
};
 
app.get('/anayfede', exports.anayfede);

require('./app/routes.js')(app, passport,server); 

server.listen(port, ipaddress);
console.log('Listening  to  port ' + port);

