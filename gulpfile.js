const syntax = "scss", // Syntax: sass or scss;
	gulpversion = "4"; // Gulp version: 3 or 4

const gulp = require("gulp"),
	postcss = require('gulp-postcss'),
	gutil = require("gulp-util"),
	sass = require("gulp-sass"),
	browserSync = require("browser-sync"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	cleancss = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	autoprefixer = require("autoprefixer"),
	notify = require("gulp-notify"),
  rsync = require("gulp-rsync");

gulp.task("browser-sync", function() {
	browserSync({
		server: {
			baseDir: "build"
		},
		online: true, // Work Offline Without Internet Connection
		tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task("styles", function() {
	return gulp.src('src/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(postcss([ autoprefixer({ grid: false, browsers: ['>1%'] }) ]))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream())
});


gulp.task('scripts', function() {
	return gulp.src([
    'src/**/*.js',
		])
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task("code", function() {
	return gulp.src("src/*.html")
	.pipe(gulp.dest('build'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task("rsync", function() {
	return gulp.src("build/**").pipe(
		rsync({
			root: "build/",
			hostname: "username@yousite.com",
			destination: "yousite/public_html/",
			exclude: ["**/Thumbs.db", "**/*.DS_Store"], // Excludes files from deploy
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		})
	);
});

if (gulpversion == 4) {
	gulp.task("watch", function() {
		gulp.watch("src/" + syntax + "/**/*." + syntax + "", gulp.parallel("styles"));
		gulp.watch(["src/**/*.js"], gulp.parallel("scripts"));
		gulp.watch("src/*.html", gulp.parallel("code"));
	});
	gulp.task("default", gulp.parallel("styles", "code", "scripts", "browser-sync", "watch"));
}
