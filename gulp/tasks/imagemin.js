// 画像圧縮
// ※圧縮が弱い・・・

var gulp = require('gulp');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var config = require('../config');
var ext = '{png,svg,jpg,jpeg,gif}';


gulp.task('imagemin:dst', function(){
  gulp.src(config.PATH.SRC + 'assets/img/**/*.' + ext)
    .pipe(changed(config.PATH.SRC + 'assets/img/**/*.' + ext))
    .pipe(gulp.dest(config.PATH.DST + 'assets/img/'));
});


gulp.task('imagemin:build', function(){
  gulp.src(config.PATH.SRC + 'assets/img/**/*.' + ext)
    .pipe(changed(config.PATH.SRC + 'assets/img/**/*.' + ext))
    .pipe(imagemin(
      {
        progressive: true,
        use: [
          require('imagemin-pngquant')()
        ],
        optimizationLevel : 7
      }
    ))
    .pipe(gulp.dest(config.PATH.BUILD + 'assets/img/'));
});
