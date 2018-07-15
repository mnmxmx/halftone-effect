// browsersync設定
var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config');
var isProduction = require('../config').isProduction;


if (isProduction) {
  config.BrowserSync.server.baseDir = config.PATH.BASE.BUILD;
}


gulp.task('browserSync', function(){
  browserSync(config.BrowserSync);
});
