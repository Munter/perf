var sites = require('./sources.js'),
    request = require('request'),
    fs = require('fs'),
    StyleStats = require('stylestats'),
    cdn = "http://assets.staticlp.com/",
    outputFile = "./css-analysis/tmp/result.json"
    refs = [], count = 0;

function getStylesheet(site, cb) {
  console.info("Fetching " + site.url);

  var parseStylesheet = function(body, cssName) {
    var stylesheetName = cssName ? "assets/" + cssName : 'assets/application-',
        test = new RegExp("(" + stylesheetName + ").+?(\.css)");
    return body.match(test) && body.match(test)[0];
  }

  request(site.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      site.sha = parseStylesheet(body, site.css)
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
  var results = JSON.stringify(refs, null, 2);
  fs.writeFile(outputFile, results, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFile);
    }
  });
}

sites.forEach(function(site){
  getStylesheet(site, function(site){
    getStyleStats(site, function(siteWithStats){
      refs.push(siteWithStats);
      (refs.length == sites.length) && outputResults();
    });
  });
});

