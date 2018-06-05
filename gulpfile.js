var gulp = require('gulp'),
		browserSync = require('browser-sync').create();
		sass = require('gulp-sass'),
		uglify = require('gulp-uglify'),
		pump = require('pump'),
		sourcemaps = require('gulp-sourcemaps'),
		rename = require("gulp-rename");

gulp.task('server', function () {

    browserSync.init({
			server: {
				baseDir: "./"
			}
    });

    gulp.watch("*.html").on("change", reload);
});

gulp.task('sass', function () {
	gulp.src(['src/sass/**/*.sass', 'src/sass/**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('minify', function (cb) {
  pump([
        gulp.src('src/js/main.js')
					.pipe(sourcemaps.init()),
	        uglify()
					.pipe(sourcemaps.write())
					.pipe(rename({
				    suffix: ".min"
				  })),
	        gulp.dest('dist/min.js')
    ],
    cb
  );
});

gulp.task('watch', function() {
	gulp.watch(['src/sass/**/*.sass', 'src/sass/**/*.scss'], ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('src/js/main.js', ['minify']);
	gulp.watch(['dist/*.html', 'src/*.html']).on['change', browserSync.reload];
  gulp.watch('src/js/**/*.js').on['change', browserSync.reload];
	gulp.watch(['dist/css/**/*.css', 'src/sass/**/*.scss']).on['change', browserSync.reload];
});

gulp.task('default', ['server', 'watch']);
