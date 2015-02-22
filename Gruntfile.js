'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    watch: {
      sass: {
        files: "dev/scss/*.scss",
        tasks: "sass:dev"
      },
      css : {
        files: "dev/css/*.css",
        tasks: "cssmin"
      },
      js : {
        files: "dev/js/*.js",
        tasks: "uglify"
      }
    },
    sass: {
      dev: {
        files: {
          "dev/css/styles.css": "dev/scss/styles.scss"
        }
      }
    },
    uglify: {
      dev: {
        files: [
          {
            src: ['dev/js/taxa.js', 'dev/js/screen.js', 'dev/js/controller.js'],
            dest: 'build/js/min.js'
          }
        ]
      }
    },
    cssmin: {
      target: {
        files: {
          'build/css/min.css': ['dev/css/reset.css', 'dev/css/styles.css']
        }
      }
    },
    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            "build/css/*.css",
            "build/*.html"
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "build/"
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserSync', 'watch']);
};