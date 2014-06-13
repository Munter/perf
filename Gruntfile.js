module.exports = function(grunt) {

  "use strict";

  require("util")._extend;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    pagespeed: {
      options: {
        nokey: true,
        url: "http://www.lonelyplanet.com"
      },
      prod: {
        options: {
          url: "http://www.lonelyplanet.com/france/paris",
          locale: "en_GB",
          strategy: "desktop",
          threshold: 80
        }
      }
    },

    phantomas : {
      grunt : {
        options : {
          indexPath: './phantomas/',
          options: {
            'timeout': 30,
            "film-strip": false
          },
          url: 'http://rizzo.lonelyplanet.com/responsive',
          group: {
            'Page Weight' : [
              "bodySize",
              'cssSize',
              'jsSize',
              'imageSize'
            ]
          }
        }
      }
    },
    cssmetrics: {
      dev: {
        src: [
          "http://assets.staticlp.com/assets/common_core_no_font.css"
        ]
      }
    },
    stylestats: {
      dev: {
        options: {
          "gzippedSize": true
        },
        src: ["http://assets.staticlp.com/assets/common_core_no_font.css"]
      }
    }


  });

  // This loads in all the grunt tasks auto-magically.
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Tasks
  grunt.registerTask("default", [ "pagespeed" ]);

};
