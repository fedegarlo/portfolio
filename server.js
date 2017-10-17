#!/bin/env node

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
    port      = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    express = require('express'),
    fs      = require('fs'),
    express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    flash    = require('connect-flash'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    api = require('instagram-node').instagram(),
    server = http.createServer(app);

api.use({
  client_id: '5c45535025534f8fa3e56bbed0892b78',
  client_secret: 'c7e2b49f5b574d3a9df97f944c5fa92b'
});

//mongoose.connect('mongodb://'+mongoauth+mongoip+':'+mongoport+'/nodejs');

app.configure(function() {
    var cacheTime = 0;
    app.use(express.cookieParser());
    app.use(express.bodyParser()); 
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: cacheTime }));
    //app.use('img', express.static('public/img', { maxAge: cacheTime }));
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


app.get('/', function(request, response) {
    response.render('index.html');
});

server.listen(port, ipaddress);
console.log('Listening  to  port ' + port);

