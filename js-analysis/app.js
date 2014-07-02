// Node modules
var request = require('request'),
    gzipSize = require('gzip-size'),

    // Config
    sites = require('./sources.js'),
    utils = require('../utils/assets.js'),
    cdn = "http://assets.staticlp.com/",
    outputFile = "./js-analysis/tmp/result"
    refs = [];

function getFileSize(site, cb) {
  request(cdn + site.sha, function (error, response, body) {
    site.sizes = {
      size: body.length,
      gzippedSize: gzipSize.sync(body)
    }
    cb(site);
  });
}

(function init() {
  sites.forEach(function(site){
    utils.getAsset(site, "js", function(site){
      getFileSize(site, function(siteWithStats){
        refs.push(siteWithStats);
        (refs.length == sites.length) && utils.outputResults(refs, outputFile);
      });
    });
  });
}());
