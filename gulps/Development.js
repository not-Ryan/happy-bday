const { series, parallel, ...gulp } = require('gulp');
const rename = require('gulp-rename');
const fs = require('fs');

const log = require('fancy-log')
const chalk = require('chalk');

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const pug = require('gulp-pug');

const ts = require('gulp-typescript');

const svg2png = require('gulp-svg2png-update');


function compileCss() {
  sass.compiler = require('sass');
  return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ level: 0, format: 'beautify' }))
    .pipe(gulp.dest('dist/css'))
}

function compileHtml() {
  return gulp.src('src/pages/**/*.pug')
    // ? Options: https://www.npmjs.com/package/gulp-pug#api
    .pipe(pug({ basedir: './src' }))
    .pipe(gulp.dest('dist/'))
}

function compileScripts() {
  return gulp.src('src/scripts/*.ts')
    .pipe(ts({ noImplicitAny: true, }))
    .pipe(gulp.dest('dist/scripts/'));
}

const generateLogos = parallel(generateLogo(100), generateLogo(500), generateLogo(1000))
function generateLogo(dimension = 100) {
  return function generate(cb) {
    cb()
    // return gulp.src('src/logo.svg')
    //   .pipe(svg2png({ width: dimension, height: dimension }))
    //   .pipe(rename(`logo-${dimension}.png`))
    //   .pipe(gulp.dest(`dist/images/logo`))
  }
}

function copyAssets() {
  return gulp.src(['src/public/**/*']).pipe(gulp.dest('dist/'));
}

function writeUpdated(cb) {
  fs.writeFile('dist/updated.txt', Date.now(), cb);
}

function watchAll() {
  const task = (task) => series(task, writeUpdated);

  gulp.watch('src/**/*.pug', task(compileHtml))
  gulp.watch('src/scss/**/*', task(compileCss))
  gulp.watch('src/scripts/**/*', task(compileScripts))
  gulp.watch('src/public/**/*', task(copyAssets))
  gulp.watch('src/logo.svg', task(generateLogos))
}

const compile = parallel(compileHtml, compileCss, compileScripts, generateLogos, copyAssets);
exports.watch = series(compile, watchAll, writeUpdated);
exports.default = compile;