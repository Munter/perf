module.exports = {

  getTimeSuffix: function() {
    var t = new Date(),
        month = t.getMonth() + 1,
        date = t.getDate();

    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    return "-" + t.getFullYear() + "-" + month + "-" + date;
  },

  getAsset: function(location, assetType, cb) {

    var request = require('request'),
        fileName, test;

    request(location.url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        fileName = location.fileName ? "assets/" + location.fileName : 'assets/application-';
        test = new RegExp("(" + fileName + ").+?(\." + assetType + ")");
        location.sha = body.match(test) && body.match(test)[0];
      }
      cb(location);
    });
  },

  getFileSize: function(site, cdn, cb) {
    var request = require('request'),
        gzipSize = require('gzip-size');

    request(cdn + site.sha, function (error, response, body) {
      site.sizes = {
        size: body.length,
        gzippedSize: gzipSize.sync(body)
      }
      cb(site);
    });
  },

  outputResults: function(buffer, outputFile) {
    var jsonminify = require("jsonminify"),
        fs = require('fs'),
        results = jsonminify(JSON.stringify(buffer, null, 2)),
        fileName = outputFile + this.getTimeSuffix() + ".json";

    fs.writeFile(fileName, results, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + fileName);
      }
    });
  }

};
