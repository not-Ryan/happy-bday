const { series, parallel, ...gulp } = require('gulp');
const rename = require('gulp-rename')

const size = require('gulp-size');
const log = require('fancy-log')
const chalk = require('chalk');
const prettyBytes = require('pretty-bytes');

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uncss = require('gulp-uncss');

const pug = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');

const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');

const svg2png = require('gulp-svg2png-update');
const imagemin = require('gulp-imagemin');

let rawTotal = 0;

function compileCss() {
  const before = size({ showTotal: false })
  const after = size({ showTotal: false })
  const name = 'Stylesheets'

  sass.compiler = require('sass');
  return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(before)
    .pipe(cleanCSS({ level: 2 }))
    // .pipe(uncss({ html: ['dist/**/*.html'] }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(after)
    .once('finish', () => {
      rawTotal += before.size;
      const filename = chalk.cyan(name)
      const precentage = (after.size / before.size * 100).toFixed(2)
      log.info(`Compiled '${filename}': ${chalk.red(before.prettySize)} → ${chalk.greenBright(after.prettySize)} (${chalk.magenta(precentage)}%)`);
    })
}

function compileHtml() {
  const before = size({ showTotal: false })
  const after = size({ showTotal: false })
  const name = 'Html'

  return gulp.src('src/pages/**/*.pug')
    // ? Options: https://www.npmjs.com/package/gulp-pug#api
    .pipe(pug({ basedir: './src' }))
    .pipe(before)
    .pipe(htmlmin({
      removeComments: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeTagWhitespace: true,
      collapseWhitespace: true,
      useShortDoctype: true,
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(after)
    .once('finish', () => {
      rawTotal += before.size;
      const filename = chalk.cyan(name)
      const precentage = (after.size / before.size * 100).toFixed(2)
      log.info(`Compiled '${filename}': ${chalk.red(before.prettySize)} → ${chalk.greenBright(after.prettySize)} (${chalk.magenta(precentage)}%)`);
    })
}

function compileScripts() {
  const before = size({ showTotal: false })
  const after = size({ showTotal: false })
  const name = 'Scripts'

  return gulp.src('src/scripts/*.ts')
    .pipe(ts({ noImplicitAny: true, }))
    .pipe(before)
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(after)
    .once('finish', () => {
      rawTotal += before.size;
      const filename = chalk.cyan(name)
      const precentage = (after.size / before.size * 100).toFixed(2)
      log.info(`Compiled '${filename}': ${chalk.red(before.prettySize)} → ${chalk.greenBright(after.prettySize)} (${chalk.magenta(precentage)}%)`);
    })
}

const generateLogos = parallel(generateLogo(100), generateLogo(500), generateLogo(1000))
function generateLogo(dimension = 100) {
  return function generate() {
    return gulp.src('src/logo.svg')
      .pipe(svg2png({ width: dimension, height: dimension }))
      .pipe(rename(`logo-${dimension}.png`))
      .pipe(imagemin({ silent: true }))
      .pipe(gulp.dest(`dist/images/logo`))
  }
}

function copyAssets() {
  const before = size({ showTotal: false })
  const after = size({ showTotal: false })
  const name = 'Assets'

  return gulp.src(['src/public/**/*'])
    .pipe(before)
    .pipe(imagemin({ silent: true }))
    .pipe(gulp.dest('dist/'))
    .pipe(after)
    .once('finish', () => {
      rawTotal += before.size;
      const filename = chalk.cyan(name)
      const precentage = (after.size / before.size * 100).toFixed(2)
      log.info(`Compiled '${filename}': ${chalk.red(before.prettySize)} → ${chalk.greenBright(after.prettySize)} (${chalk.magenta(precentage)}%)`);
    })
}

function countTotal() {
  const after = size({ showTotal: false })
  return gulp.src(['dist/**/*'])
    .pipe(after)
    .once('finish', () => {
      const filename = chalk.cyan.bold('Everything')
      const precentage = (after.size / rawTotal * 100).toFixed(2)
      log.info(`Compiled '${filename}': ${chalk.red(prettyBytes(rawTotal))} → ${chalk.greenBright(after.prettySize)} (${chalk.magenta(precentage)}%)`);
    })
}

exports.default = series(parallel(
  compileHtml,
  compileCss,
  compileScripts,
  copyAssets,
  // generateLogos
), countTotal);