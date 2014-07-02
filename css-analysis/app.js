// Node modules

var StyleStats = require('stylestats'),

    // Config
    sites = require('./sources.js'),
    utils = require('../utils/assets.js'),
    cdn = "http://assets.staticlp.com/",
    outputFile = "./css-analysis/tmp/result"
    refs = [];


function getStyleStats(site, cb) {
  var stylesheet = cdn + site.sha,
      stats = new StyleStats(stylesheet, {"gzippedSize": true});

  stats.parse(function (error, result) {
    site.result = result;
    cb(site);
  });
}


(function init() {
  sites.forEach(function(site){
    utils.getAsset(site, "css", function(site){
      getStyleStats(site, function(siteWithStats){
        refs.push(siteWithStats);
        (refs.length == sites.length) && utils.outputResults(refs, outputFile);
      });
    });
  });
}());
