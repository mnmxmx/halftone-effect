var gulp = require("gulp");
var glslify = require("gulp-glslify");

var gulpif = require("gulp-if");
var config = require("../config");
var isProduction = require('../config').isProduction;

// var path = "assets/test";


gulp.task("glsl", null, function() {
  gulp.src("src/**/*.{vert,frag}")
    .pipe(glslify())
    .pipe(gulpif(isProduction, gulp.dest(config.PATH.BUILD), gulp.dest(config.PATH.DST)));
});