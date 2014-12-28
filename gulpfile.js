require('es6-shim');
var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
//var gutil = require('gulp-util');
//var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
//var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var reactify = require('reactify');
var browserify = require('browserify');
var transform = require('vinyl-transform');

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

function scripts(watch) {
    var bundler,
        start = './src/client/js/main.js',
        options = { debug: true };

    if (watch) {
        bundler = watchify(browserify(start, Object.assign({}, watchify.args, options)));
        bundler.on('update', rebundle);
    } else {
        bundler = browserify(start, options);
    }

    bundler.transform(reactify, { debug: true, harmony: true });

    function rebundle() {
        console.log("re-building js files");
        return bundler.bundle()
            .on('error', swallowError)
            .pipe(source('main.js'))
            .pipe(gulp.dest('dist/js'));
    }

    return rebundle();
}

gulp.task('js-build', function() {
    return scripts(false);
});

gulp.task('js-watch', function() {
    return scripts(true);
});

gulp.task('sass', function () {
    gulp.src(['src/client/sass/reset.scss','src/client/sass/*.scss'])
        .pipe(sass({ style: 'compressed' }).on('error', swallowError))
        .pipe(concat('core.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function() {
    gulp.src('src/client/*.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js-build', 'copy', 'sass']);

gulp.task('watch', function() {
    scripts(true);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/client/*.html', ['copy']);
});