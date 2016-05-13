var gulp = require('gulp-help')(require('gulp'));
var karma = require('karma'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config'),
    runSequence = require('run-sequence'),
    argv = require('yargs').argv
    ;

gulp.task('test', 'Run unit tests', function (done) {
    return runSequence(
        'compile:spec',
        'test:spec',
        done
    )
});

gulp.task('compile:spec', 'Compile typescript for tests', function () {
    return gulp.src(['typings/browser/**/*.d.ts', './src/**/*.ts', './test/**/*.spec.ts'])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./tmp'));
});

gulp.task('test:spec', 'Runs spec tests', function(done) {
    new karma.Server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: argv.watch ? false : true,
        captureTimeout: argv.timeout || 20000
    }, done);
});