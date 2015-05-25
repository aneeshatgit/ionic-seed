var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jade = require('gulp-jade');
var inject = require('gulp-inject');


var paths = {
  sass: ['./scss/**/*.scss'],
  jade: ['./jade/*.jade'],
  js: ['./www/js/*.js'],
  js: ['./www/js/**/*.js'],
  index: ['./www/gulp-index/index.html']
};

gulp.task('default', ['sass', 'jade']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('jade', function (done) {
    return gulp.src(paths.jade)
      .pipe(jade())
      .pipe(gulp.dest('./www/templates/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.js, ['inject']);
  gulp.watch(paths.index, ['inject']);

});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('inject', function () {
  var target = gulp.src('./www/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var fragments = gulp.src(['./www/js/**/*.js'], {read: false});
 
  return target
    .pipe(inject(fragments, {ignorePath: 'www/', addRootSlash: false, name: 'fragments'}))
    .pipe(gulp.dest('./www'));
});
