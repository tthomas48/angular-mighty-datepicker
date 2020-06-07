/* global console */
require("gulp-watch");
var gulp    = require("gulp"),
    gutil = require('gulp-util'),
    clean   = require("gulp-clean"),
    connect = require("gulp-connect"),
    changed = require("gulp-changed"),
    bower   = require("gulp-bower"),
    // compilers
    eslint = require("gulp-eslint"),
    less    = require("gulp-less"), // gulp-sass is broken
    plumber = require('gulp-plumber');

var warn = function(err) { console.warn(err); };
var paths = {
  src: "./src/",
  dst: "./build/"
}

var onError = function (err) {
  gutil.beep();
  console.log(err);
};

gulp.task("default", ["bower", "build"]);

gulp.task("build", ["copy", "less"])

gulp.task("server", ["build", "watch"], function() {
  connect.server({
    root: '.',
    port: 8000
  });
});

gulp.task("clean", function(){
  return gulp.src(paths.dst, {read: false})
    .pipe(clean());
})

gulp.task("watch", function(){
  return gulp.watch(paths.src + "**/*", ["build"]);
});

gulp.task("bower", function() {
  return bower("bower_components")
    .pipe(gulp.dest("bower_components"))
});

// compilers

gulp.task("less", function(){
  return gulp.src(paths.src + "**/*.less")
    .pipe(changed(paths.dst, { extension: '.css' }))
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(less().on('error', warn))
    .pipe(gulp.dest(paths.dst))
    .pipe(connect.reload());
});

gulp.task("copy", function(){
  return gulp.src(paths.src + "**/*.js")
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
    .pipe(changed(paths.dst))
    .pipe(gulp.dest(paths.dst))
    .pipe(connect.reload());
});
//
