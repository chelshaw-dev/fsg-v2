var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(){
  return gulp.src('public', {read: false})
    .pipe(clean());
})
gulp.task('images', function() {
  return gulp.src('app/images/*.*')
    .pipe(gulp.dest('public/images'));
});
gulp.task('fonts', function(){
  return gulp.src('app/vendor/font-awesome/fonts/*.*')
    .pipe(gulp.dest('public/fonts'));
});
gulp.task('views', function() {
  return gulp.src('app/views/*.html')
    .pipe(gulp.dest('public/views'));
});

gulp.task('html', ['views'], function() {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('public'));
});

gulp.task('css', function() {
  return gulp.src([
    'app/vendor/font-awesome/css/font-awesome.min.css',
    'app/vendor/bootstrap-social/bootstrap-social.css',
    'app/vendor/bootstrap/css/bootstrap.css'
  ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

gulp.task('vendor-scripts', function() {
  gulp.src([
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/skrollr/dist/skrollr.min.js'
  ])
    .pipe(gulp.dest('public/lib'));
});

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
  gulp.watch('app/index.html', ['html']);
  gulp.watch('app/views/*.html', ['views']);
});

gulp.task('build', ['clean'], function() {
  gulp.start('css');
  gulp.start('sass');
  gulp.start('html');
  gulp.start('images');
  gulp.start('fonts');
  gulp.start('vendor-scripts');
  gulp.start('scripts');
  gulp.src(['initialize.js'])
    .pipe(gulp.dest('public/js'));
})
