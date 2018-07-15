var gulp = require("gulp");
var gulpif = require("gulp-if");
var sass = require("gulp-sass");
var plumber = require('gulp-plumber');
var csswring = require('csswring');
var config = require("../config");
var AUTOPREFIXER = require("../config").AUTOPREFIXER;
var isProduction = require('../config').isProduction;

gulp.task("css", function () {

  var postcss = require("gulp-postcss");
  var postcssOptions = [
    require('postcss-mixins'),
    require("autoprefixer")({ browsers: AUTOPREFIXER }),
    require("css-mqpacker")({ sort: function (a, b) { return b.localeCompare(a); } }),
    require("postcss-flexbugs-fixes"),
    require("postcss-partial-import")()
  ];

  if (isProduction)
  {
    postcssOptions.push(csswring);
  }

  gulp.src(config.PATH.SRC + "assets/css/styles.scss")
    .pipe(plumber())
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(postcss(postcssOptions))
    .pipe(gulpif(isProduction, gulp.dest(config.PATH.BUILD + "assets/css/"), gulp.dest(config.PATH.DST + "assets/css/")));
});
