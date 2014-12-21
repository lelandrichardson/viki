var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('browserify', function() {
    gulp.src('src/client/js/main.js')
      .pipe(browserify({ transform: 'reactify', debug: true }).on('error', swallowError))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/js'));
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

gulp.task('default', ['browserify', 'copy', 'sass']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});