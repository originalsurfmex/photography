'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

//remove spaces from image file names they cause chaos
gulp.task("underscore", function (done) {
    gulp.src("images/*.*")
      //.pipe(changed("images/"))
  
      //Remove Space
      .pipe(rename(function(opt) {
        opt.basename = opt.basename.split(' ').join('_');
        return opt;
      }))
  
      //Copy to destination
      .pipe(gulp.dest("images/renamed_source"));
      done();
  });

gulp.task('resize', function () {
    return gulp.src('images/renamed_source/*.*')
        .pipe(imageResize({
            width: 1024,
            imageMagick: true,
            format: "jpg"
        }))
        .pipe(gulp.dest('images/fulls'))
        .pipe(imageResize({
            width: 512,
            imageMagick: true,
            format: "jpg"
        }))
        .pipe(gulp.dest('images/thumbs'));
});

gulp.task('del', ['resize'], function () {
    return del(['images/*.*']);
});

// compile scss to css
gulp.task('sass', function () {
    return gulp.src('assets/sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('assets/css'));
});

// watch changes in scss files and run sass task
gulp.task('sass:watch', function () {
    gulp.watch('assets/sass/**/*.scss', ['sass']);
});

// minify js
gulp.task('minify-js', function () {
    return gulp.src('assets/js/main.js')
        .pipe(uglify())
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('assets/js'));
});

// default task
gulp.task('default', ['underscore','resize', 'sass', 'minify-js']);

// scss compile task
gulp.task('compile-sass', ['sass', 'minify-js']);