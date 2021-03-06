var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var minifycss = require('gulp-clean-css');
var replace = require('gulp-replace');
var fs = require('fs');
var fileinclude = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');

var paths = {
  sass: {
    src: './src/style/*.scss',
    dest: './dist/style',
    watch: './src/style/**/*.scss'
  },
  html: {
    src: './src/index.html',
    dest: './docs'
  },
  amp: {
    src: './src/amp.html',
    dest: './docs/amp'
  },
  images: {
    src: './src/images/**/*',
    dest: './docs/images'
  },
  font: {
    src: './src/font/**/*',
    dest: './docs/font'
  }
};

// CSS

gulp.task('sass', function() {
  return gulp
    .src(paths.sass.src)
    .pipe(sass())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.sass.dest));
});

// HTML

gulp.task('html', function() {
  return (
    gulp
      .src(paths.html.src)
      .pipe(
        fileinclude({
          prefix: "@@",
        })
      )
      .pipe(
        replace(/<link href="([^\.]+\.css)"[^>]*>/g, function (s) {
          var style = fs.readFileSync(
            paths.sass.dest + "/default.min.css",
            "utf8"
          );
          return "<style>" + style + "</style>";
        })
      )
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          minifyJS: true,
          processScripts: ["application/ld+json", "application/json"],
        })
      )
      .pipe(gulp.dest(paths.html.dest))
  );
});

// AMP

gulp.task('amp', function() {
  return (
    gulp
      .src(paths.amp.src)
      .pipe(
        fileinclude({
          prefix: "@@",
        })
      )
      .pipe(
        replace(/<link href="([^\.]+\.css)"[^>]*>/g, function (s) {
          var style = fs.readFileSync(paths.sass.dest + "/amp.min.css", "utf8");
          return "<style amp-custom>" + style + "</style>";
        })
      )
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          minifyJS: true,
          processScripts: ["application/ld+json", "application/json"],
        })
      )
      .pipe(rename({ basename: "index" }))
      .pipe(gulp.dest(paths.amp.dest))
  );
});

// Images

gulp.task('images', function() {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
});

// Font

gulp.task('font', function() {
  return gulp
    .src(paths.font.src)
    .pipe(gulp.dest(paths.font.dest));
});

// Watch

gulp.task('watch', function() {
  gulp.watch(paths.sass.watch, gulp.series('sass'));
  gulp.watch(paths.html.src, gulp.series('html'));
});

// Default

gulp.task('default', gulp.series('sass', 'html', 'amp', 'images', 'font'));
