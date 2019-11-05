const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');

gulp.task('styles', () => {
    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('clean', () => {
    return del([
        'public/css/style.css',        
        'public/js/style.css',
    ]);
});

gulp.task('autoprefixer', () => {
  const autoprefixer = require('autoprefixer');
  const sourcemaps = require('gulp-sourcemaps');
  const postcss = require('gulp-postcss');

  return gulp.src('./css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./public/css/'));
});

gulp.task('js:bundle', () => {
  const browserify = require('browserify');
  const babelify = require('babelify');
  const gulp = require('gulp');
  const source = require('vinyl-source-stream');
  const buffer = require('vinyl-buffer');
  const sourcemaps = require('gulp-sourcemaps');
  const util = require('gulp-util');
  let b = browserify({
    entries: './js/index.js',
    debug: true,
    transform: [babelify.configure({
      presets: ['es2015']
    })]
  });

  return b.bundle()
    .pipe(source('./js/index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      // Add other gulp transformations (eg. uglify) to the pipeline here.
      .on('error', util.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

gulp.task('default', gulp.series(['styles', 'autoprefixer', 'js:bundle']));