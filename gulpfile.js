var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(){
  return gulp.src('public', {read: false})
    .pipe(clean());
})

gulp.task('views', function() {
  return gulp.src('app/views/*.html')
    .pipe(gulp.dest('public/views'))
});
gulp.task('html', ['views'], function() {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('public'))
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
});

gulp.task('vendor-scripts', function() {
  gulp.src([
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js'
  ])
    .pipe(gulp.dest('public/lib'));
})
gulp.task('scripts', function() {
  return gulp.src([
    'app/js/app.js',
    'app/js/*/*.js'
  ])
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['scripts']);
  gulp.watch('app/index.html', ['html'])
});

gulp.task('build', ['clean'], function() {
  gulp.start('sass');
  gulp.start('html');
  gulp.start('vendor-scripts');
  gulp.start('scripts');
})
