/*
 * Copyright (c) 2017 Jeremy Thomerson
 * Licensed under the MIT license.
 */
var path = require('path'),
    getCodeVersion = require('silvermine-serverless-utils/src/get-code-version');

const sass = require('sass');

module.exports = function(grunt) {

   var DEBUG = !!grunt.option('debug'),
       pkgJSON = grunt.file.readJSON('package.json'),
       config, versionInfo;

   try {
      versionInfo = getCodeVersion.both();
   } catch(e) {
      // When this package is installed as a git URL, getCodeVersion throws an error and
      // is not able to find the git version for this package. So, we fall back to using
      // the version number from package.json
      versionInfo = pkgJSON.version;
   }

   config = {
      js: {
         all: [ 'Gruntfile.js', 'src/**/*.js', 'tests/**/*.js' ],
         standalone: path.join(__dirname, 'src', 'js', 'standalone.js'),
      },

      sass: {
         base: path.join(__dirname, 'src', 'scss'),
         all: [ 'src/**/*.scss' ],
      },

      dist: {
         base: path.join(__dirname, 'dist'),
         jsFileName: 'silvermine-videojs-quality-selector',
      },
   };

   config.dist.js = {
      bundle: path.join(config.dist.base, 'js', '<%= config.dist.jsFileName %>.js'),
      minified: path.join(config.dist.base, 'js', '<%= config.dist.jsFileName %>.min.js'),
   };

   config.dist.css = {
      base: path.join(config.dist.base, 'css'),
      all: path.join(config.dist.base, '**', '*.css'),
   };

   grunt.initConfig({

      pkg: pkgJSON,
      versionInfo: versionInfo,
      config: config,

      browserify: {
         main: {
            src: config.js.standalone,
            dest: config.dist.js.bundle,
            options: {
               transform: [
                  [
                     'babelify',
                     {
                        presets: [
                           [
                              '@babel/preset-env',
                              {
                                 debug: true,
                                 useBuiltIns: 'usage',
                                 shippedProposals: true,
                                 corejs: 3,
                              },
                           ],
                        ],
                     },
                  ],
               ],
            },
         },
      },

      uglify: {
         main: {
            files: {
               '<%= config.dist.js.minified %>': config.dist.js.bundle,
            },
            options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> <%= versionInfo %> */\n',
               sourceMap: true,
               sourceMapIncludeSources: true,
               mangle: !DEBUG,
               compress: !DEBUG,
               beautify: DEBUG,
            },
         },
      },

      sass: {
         options: {
            implementation: sass,
            sourceMap: DEBUG,
            indentWidth: 3,
            outputStyle: DEBUG ? 'expanded' : 'compressed',
            sourceComments: DEBUG,
         },
         main: {
            files: [
               {
                  expand: true,
                  cwd: config.sass.base,
                  src: [ '**/*.scss' ],
                  dest: config.dist.css.base,
                  ext: '.css',
                  extDot: 'first',
               },
            ],
         },
      },

      postcss: {
         options: {
            map: DEBUG,
            processors: [
               require('autoprefixer')({ browsers: '> .05%' }), // eslint-disable-line global-require
            ],
         },
         main: {
            src: config.dist.css.all,
         },
      },

      clean: {
         dist: config.dist.base,
      },

      watch: {
         grunt: {
            files: [ 'Gruntfile.js' ],
            tasks: [ 'build' ],
         },

         js: {
            files: [ 'src/**/*.js' ],
            tasks: [ 'build-js' ],
         },

         css: {
            files: [ 'src/**/*.scss' ],
            tasks: [ 'build-css' ],
         },
      },
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-postcss');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-sass');

   grunt.registerTask('build-js', [ 'browserify', 'uglify' ]);
   grunt.registerTask('build-css', [ 'sass', 'postcss' ]);
   grunt.registerTask('build', [ 'build-js', 'build-css' ]);
   grunt.registerTask('develop', [ 'build', 'watch' ]);
   grunt.registerTask('default', [ 'standards' ]);

};
