const gulp = require('gulp');

const DEVELOPMENT = require('./gulps/Development')
const PRODUCTION = require('./gulps/Production').default

gulp.task('watch', DEVELOPMENT.watch)
gulp.task('default', DEVELOPMENT.default)
gulp.task('compile', PRODUCTION)
