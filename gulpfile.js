var gulp = require('gulp');
// var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}


// gulp.task('script', function(){
 
//   if(!jsBundler)
//     jsBundler = watchify('./'+cjs+'index.js')
//       .transform('hbsfy')       // Enable require('template.hbs')
 
//   return pipeline(
 
//     jsBundler.bundle({            // Compile
//       insertGlobals: true,
//       debug: dev                // Source maps (for development)
//     }),
//     vsrc('script.js'),
//     gulpif(!dev, gulpUglify()),   // Compress (for production)
//     gulp.dest( dest+'js/' ),
//     gulpLivereload(lrserver)
 
//   ).on('error', onErr);
 
// });
 
 
 
// // Handle errors from our tasks
// function onErr(err){
//   var sig  = '['+chak.red(err.plugin||'gulp task')+']';
//   if(err.plugin)
//     console.warn( sig, '\n', err.message
//                , '\n\n', err.fileName+':'+err.lineNumber, '\n')
//   else
//     console.warn( sig, '\n', err, '\n' );
//   this.emit('end'); // Don't break the watch task
// };




var bundler = watchify(browserify('./src/client/js/main.js', { debug: true }));
// add any other browserify options or transforms here
bundler.transform('reactify', { harmony: true, debug: true });

gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))

    // optional, remove if you dont want sourcemaps
      // .pipe(buffer())
      // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      // .pipe(sourcemaps.write('./')) // writes .map file
    //
    //.pipe(concat('main.js'))

    .pipe(gulp.dest('./dist/js'));
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

gulp.task('default', ['js', 'copy', 'sass']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});