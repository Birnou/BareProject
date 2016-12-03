var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var bowerNormalizer = require('gulp-bower-normalize');

var concatJS = require("gulp-concat");
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var concatCss = require('gulp-concat-css');
var cleanCSS  = require('gulp-clean-css');

var flatten = require('gulp-flatten');
var del = require('del');
var vinylPaths = require('vinyl-paths');


gulp.task('regroupedist', function() {
    return gulp.src('bower.json')
		.pipe(mainBowerFiles())
        .pipe(bowerNormalizer({bowerJson:'bower.json'}))
        .pipe(gulp.dest('temp'));
});
gulp.task("concatJS", ['regroupedist'], function () {
    return gulp.src("temp/**/js/*.js")
        .pipe(concatJS('main.js'))
        .pipe(gulp.dest('libs'))
		.pipe(rename('main.min.js'))
		.pipe(uglify())
        .pipe(gulp.dest('libs'));
});
gulp.task('concatCSS', ['regroupedist'], function () {
	return gulp.src('temp/**/css/*.css')
		.pipe(concatCss("main.min.css"))
		.pipe(cleanCSS({}))
		.pipe(gulp.dest('libs'));
});
gulp.task('copyImages', ['regroupedist'], function () {
	return gulp.src("temp/**/images/*.{png,gif,jpeg,jpg}")
		.pipe(flatten())
        .pipe(gulp.dest("libs/images/"));
});
gulp.task('removetemp', ['concatJS','concatCSS','copyImages'], function () {
	return gulp.src('temp')
		.pipe(vinylPaths(del));
});
gulp.task('default', ['regroupedist','concatJS','concatCSS','copyImages','removetemp']);