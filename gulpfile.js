const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');

gulp.task('styles', () => {
    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

gulp.task('clean', () => {
    return del([
        'css/style.css',
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

gulp.task('default', gulp.series(['styles', 'autoprefixer']));