// Node modules

var request = require('request'),
    fs = require('fs'),
    jsonminify = require("jsonminify"),
    StyleStats = require('stylestats'),

// Config

    sites = require('./sources.js'),
    cdn = "http://assets.staticlp.com/",
    outputFile = "./css-analysis/tmp/result"
    refs = [], count = 0;

function getTimeSuffix() {
  var t = new Date(),
      month = t.getMonth() + 1;

  month = month < 10 ? "0" + month : month;
  return "-" + t.getFullYear() + "-" + month + "-" + t.getDate();
}

function getStylesheet(site, cb) {
  request(site.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var stylesheetName = site.css ? "assets/" + site.css : 'assets/application-',
          test = new RegExp("(" + stylesheetName + ").+?(\.css)");
      site.sha = body.match(test) && body.match(test)[0];
    }
    cb(site);
  });
}

function getStyleStats(site, cb) {
  var stylesheet = cdn + site.sha,
      stats = new StyleStats(stylesheet, {"gzippedSize": true});

  stats.parse(function (error, result) {
    site.result = result;
    cb(site);
  });
}

function outputResults() {
  var results = jsonminify(JSON.stringify(refs, null, 2)),
      fileName = outputFile + getTimeSuffix() + ".json";

  fs.writeFile(fileName, results, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + fileName);
    }
  });
}

(function init() {
  sites.forEach(function(site){
    getStylesheet(site, function(site){
      getStyleStats(site, function(siteWithStats){
        refs.push(siteWithStats);
        (refs.length == sites.length) && outputResults();
      });
    });
  });
}());
