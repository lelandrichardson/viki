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

function scripts(input, output, watch) {
    var bundler,
        options = { debug: true };

    if (watch) {
        bundler = watchify(browserify(input, Object.assign({}, watchify.args, options)));
        bundler.on('update', rebundle);
    } else {
        bundler = browserify(input, options);
    }

    bundler.transform(reactify, { debug: true, harmony: true });

    function rebundle() {
        console.log("building '" + input + "' -> '" + output + "'");
        return bundler.bundle()
            .on('error', swallowError)
            .pipe(source(output))
            .pipe(gulp.dest('dist/js'));
    }

    return rebundle();
}

gulp.task('js-build', function() {
    scripts('./src/client/js/lib.js','lib.js', false);
    scripts('./src/client/js/main.js','main.js', false);
});

gulp.task('js-watch', function() {
    scripts('./src/client/js/lib.js','lib.js', true);
    scripts('./src/client/js/main.js','main.js', true);
});

gulp.task('sass', function () {
    gulp.src([

        // reset
        'src/client/sass/reset.scss',

        // framework
        'src/client/sass/base.scss',
        'src/client/sass/button.scss',
        'src/client/sass/form.scss',
        'src/client/sass/typography.scss',
        'src/client/sass/utility.scss',

        // widgets
        'src/client/sass/*.scss'
    ])
        .pipe(sass({ style: 'compressed' }).on('error', swallowError))
        .pipe(concat('core.css'))
        .pipe(gulp.dest('dist/css'));

    gulp.src(['node_modules/react-select/dist/default.css'])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('dist/css'));
});

var FILES_TO_COPY = [
    'src/client/**/*.html',
    'src/client/**/*.jpg',
    'src/client/**/*.png'
];

gulp.task('copy', function() {
    gulp.src(FILES_TO_COPY)
      .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js-build', 'copy', 'sass']);

gulp.task('watch', function() {
    scripts('./src/client/js/lib.js','lib.js', true);
    scripts('./src/client/js/main.js','main.js', true);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch(FILES_TO_COPY, ['copy']);
});