var gulp       = require('gulp'),
    browserify = require('browserify'),
    babelify   = require('babelify'),
    concat     = require('gulp-concat'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    source     = require('vinyl-source-stream');

var defaultTasks = [];
var buildTasks   = [];
var dest         = './dist';
var jsSource     = './src/js';
var jsEntry      = jsSource += '/backgrounded.js';
var jsOutput     = 'backgrounded.min.js';

var bowerDir = function(dir) {
    return './bower_components/' + dir;
};

var includes = {
    foundation: bowerDir('foundation/scss')
};

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

// Vendor Scripts
gulp.task('vendor-scripts', function() {
    return gulp.src([
        //includes.three + 'three.min.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest + '/js'));
});
defaultTasks.push('vendor-scripts');
buildTasks.push('vendor-scripts');

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

gulp.task('move-resources', function() {
    gulp.src('resources/assets/**/*')
        .pipe(gulp.dest('./html/assets'));
});
defaultTasks.push('move-resources');
buildTasks.push('move-resources');

gulp.task('watch-resources', function() {
    gulp.watch(['./resources/assets/**/*'], ['move-resources']);
});
defaultTasks.push('watch-resources');

gulp.task('default', defaultTasks);
gulp.task('build', buildTasks);
