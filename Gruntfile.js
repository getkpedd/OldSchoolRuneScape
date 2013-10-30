module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // JavaScript tasks
    jshint: {
      options: {
        reporter: 'checkstyle',
        reporterOutput: 'build/lint.xml'
      },
      build: {
        options: {          
          ignores: ['src/lib/*.js'],
          
          '-W061': true, //disable eval warning
          '-W103': true //disable __proto__ warning
        },
        src: ['src/**/*.js']
      }
    },
    uglify: {
      options: {
        report: 'min'
      },
      build: {
        files: {
          'build/game.min.js': ['src/**/*.js']
        }
      }
    },

    // CSS tasks
    concat: {
      build: {
        files: {
          'build/game.css': ['css/**/*.css'],
          'build/game.js': ['src/**/*.js']
        }
      }
    },
    autoprefixer: {
      build: {
        files: {
          'build/game.css': ['css/**/*.css']
        }
      }
    },
    cssmin: {
      options: {
        report: 'min'
      },
      build: {
        files: {
          'build/game.min.css': 'build/game.css'
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'autoprefixer', 'cssmin']);

};