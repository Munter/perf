var sites = require('./sources.js'),
    utils = require('../utils/assets.js'),
    cdn = "http://assets.staticlp.com/",
    outputFile = "./js-analysis/tmp/result"
    refs = [];


(function init() {
  sites.forEach(function(site){
    utils.getAsset(site, "js", function(site){
      utils.getFileSize(site, cdn, function(siteWithStats){
        refs.push(siteWithStats);
        (refs.length == sites.length) && utils.outputResults(refs, outputFile);
      });
    });
  });
}());
