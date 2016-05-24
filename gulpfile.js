var gulp       = require('gulp'),
    browserify = require('browserify'),
    babelify   = require('babelify'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    source     = require('vinyl-source-stream');

var defaultTasks = [];
var buildTasks   = [];
var dest         = './dist';
var jsSource     = './src/js';
var jsEntry      = jsSource += '/backgrounded.js';
var jsOutput     = 'backgrounded.min.js';

// Helper function to transpile JS
// http://stackoverflow.com/questions/24992980/how-to-uglify-output-with-browserify-in-gulp
function transpileJS(entryPoint, outputName, outputPath, debug) {
    return function() {
        var bundler = browserify(entryPoint, { debug: debug, standalone: 'backgrounded' })
          .transform(babelify)
          .bundle()
          .on("error", function (err) { console.log("Error : " + err.message); })
          .pipe(source(outputName));

        if(!debug) {
            bundler = bundler.pipe(buffer())
              .pipe(uglify());
        }

        return bundler.pipe(gulp.dest(outputPath));
    }
}

// Compile client es6 code
gulp.task('client-code', transpileJS(jsEntry, jsOutput, dest + '/js', true));
gulp.task('prod-code', transpileJS(jsEntry, jsOutput, dest + '/js', false));
defaultTasks.push('client-code');
buildTasks.push('prod-code');

// Watches script directories and rebuilds on change
gulp.task('watch-scripts', function() {
    gulp.watch([
        jsSource + '/**/*.js',
    ], function() {
        console.log("~~~ Rebuilding Scripts... ~~~");
    });

    gulp.watch([
        './src/js/**/*.js'
    ], ['client-code']);
});
defaultTasks.push('watch-scripts');

gulp.task('default', defaultTasks);
gulp.task('build', buildTasks);
