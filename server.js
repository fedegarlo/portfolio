#!/bin/env node

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
    port      = process.env.OPENSHIFT_NODEJS_PORT || 3002,
    fs      = require('fs'),
    express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    flash    = require('connect-flash'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    api = require('instagram-node').instagram(),
    server = http.createServer(app),
    rp = require('request-promise'),
    moment = require('moment');

var mongoip = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost',
    mongoport = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017',
    mongoauth = mongoip === 'localhost' ? '' : 'admin:Ggn_yp3e4vdz@',
    tsec = null;

require('./models/Chapters');

api.use({
  client_id: '5c45535025534f8fa3e56bbed0892b78',
  client_secret: 'c7e2b49f5b574d3a9df97f944c5fa92b'
});

mongoose.connect('mongodb://'+mongoauth+mongoip+':'+mongoport+'/nodejs');

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

exports.afi = function(req, res) {

    getTsec().then(() => {
        callAfi(tsec, req.body).then(function(response){
            res.send(response);
            });
    });
};

function callAfi(tsec, body) {
var options = {
    uri: 'https://www.bbva.es/ASO/mortgagesActions/V01/simulation',
    method: 'POST',
    body: body,
    headers: { tsec : tsec},
    json: true // Automatically parses the JSON string in the response 
};
    return rp(options);
}

function getTsec() {
    return rp({
      uri: 'https://www.bbva.es/BBVANet/api/granting-tickets-oauth/',
      json: true // Automatically parses the JSON string in the response 
    }).then(function (json) {
      tsec = json.access_token;
    });
  }

app.get('/invest', function(req, res) {
    getTsec().then(() => {
      var years = +req.query.years;
      var uri = 'https://www.bbva.es/ASO/management-entity-funds/v0/management-entity-funds/ES0157663008/future-projections?' +
      'projections.fromProjectionDate=' + moment().endOf('month').format('DD-MM-YYYY') +
      '&projections.toProjectionDate=' + moment().add(years, 'years').endOf('month').format('DD-MM-YYYY') +
      '&initialContribution.amount=' + req.query.initialContribution +
      '&initialContribution.currency=EUR' +
      '&addedContribution.amount=' + req.query.addedContribution;
      
      rp({
        uri: uri,
        headers: {
          tsec: tsec
        },
        json: true // Automatically parses the JSON string in the response 
      })
      .then(function (json) {
        var confidence = json.items.map(item => item.confidence).sort();
        res.send(
          json.items.find(item => item.confidence===confidence[2])
        );
      })
      .catch(function(err) {
        console.warn(err);
        res.status(509).end();
      });
    });
  });

exports.macfoolsRss = function(req, res) {
var Podcast = require('podcast');
 
/* lets create an rss feed */
var feed = new Podcast({
    title: 'Macfools',
    description: 'Mezclamos tecnología, desarrollo de software, videojuegos y algún otro tema que se nos ocurra. Empezamos de nuevo cada programa y no te lo puedes perder.',
    feed_url: 'http://www.fedegarlo.com/rss/macfools',
    site_url: 'http://www.fedegarlo.com',
    image_url: 'http://nodejs-fedegarlo.rhcloud.com/sites/macfools/podcast/cover.jpg',
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
    itunesImage: 'http://nodejs-fedegarlo.rhcloud.com/sites/macfools/podcast/cover.jpg'
});
var Chapter = mongoose.model('Chapter');

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields


var posts = [],
    xml,
    defaultItems = {
        author : 'Fede García'
    };
Chapter.find({}, function(err, chapters){
    if(err){ return next(err); }
    posts = chapters;
    for(var key in posts) {
        feed.item({
            title:  posts[key].title,
            description: posts[key].description,
            url: posts[key].link, // link to the item 
            //guid: posts[key].guid, // optional - defaults to url 
            date: posts[key].pubDate, // any format that js Date can parse.
            itunesAuthor: defaultItems.author,
            itunesExplicit: false,
            itunesSubtitle: posts[key].description,
            itunesSummary: posts[key].summary,
            itunesDuration: posts[key].duration,
            itunesKeywords: posts[key].keywords,
            enclosure: posts[key].enclosure
        });
        //feed.items[key].custom_elements[2]['itunes:summary'] = ('<![CDATA[ ' + feed.items[key].custom_elements[2]['itunes:summary']).replace(/\]\]>/g, ']]]]><![CDATA[>') + ' ]]>';
    };

        xml = feed.xml();
        res.set('Content-Type', 'text/xml');
        res.send(xml);
});


};

app.get('/tag/:tag_name', exports.tagsearch);
app.get('/rss/macfools', exports.macfoolsRss);
app.post('/afi', exports.afi);
app.use('/sites', express.static(__dirname + '/public/sites'));

app.get('/', function(request, response) {
    response.render('index.html');
});


server.listen(port, ipaddress);
console.log('Listening  to  port ' + port);

