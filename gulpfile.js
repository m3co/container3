'use strict';

const gulp         = require('gulp');
const csslint      = require('gulp-csslint');
const htmlhint     = require("gulp-htmlhint");
const eslint       = require('gulp-eslint');
const babel        = require('gulp-babel');
const connect      = require('gulp-connect');
const jsdoc        = require('gulp-jsdoc3');
const gulpIf       = require('gulp-if');
const argv         = require('yargs').argv;
const fileinclude  = require('gulp-file-include');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const paths = {
  src:   './src',
  dst:   './build',
  css:   ['./src/**/*.s{c,a}ss'],
  js:    ['./src/**/*.js'],
  html:  ['./src/**/*.html'],
  fonts: ['./src/**/*.{eot,ttf,woff,woff2}'],
  json:  ['./src/**/*.json']
};

const port = (argv.port === undefined) ? 8080 : argv.port;

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('reload', function () {
  return gulp.src(paths.src, { read: false })
    .pipe(connect.reload());
});

gulp.task('doc', () => {
  // var config = require('./.jsdoc.json');
  // return gulp.src(['./README.md'].concat(paths.js))
  //   .pipe(jsdoc(config));
});

gulp.task('css-lint', () => {
  // return gulp.src(paths.css)
  //   .pipe(csslint())
  //   .pipe(csslint.formatter());
});

gulp.task('html-hint', () => {
  return gulp.src(paths.html)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
});

gulp.task('js-lint', () => {
  return gulp.src(paths.js, { base: './' })
    .pipe(fileinclude({
      prefix: '@@',
      indent: true
    }))
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('./')));
});

gulp.task('js-copy', () => {
  return gulp.src(paths.js)
    .pipe(fileinclude({
      prefix: '@@',
      indent: true
    }))
    .pipe(babel())
    .pipe(gulp.dest(paths.dst));
});

gulp.task('css-copy', () => {
  // return gulp.src(paths.css)
  //   .pipe(gulp.dest(paths.dst));
});

gulp.task('html-copy', () => {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dst));
});

gulp.task('fonts-copy', () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dst));
});

gulp.task('json-copy', () => {
  return gulp.src(paths.json)
    .pipe(gulp.dest(paths.dst));
});

gulp.task('sass', function () {
  return gulp.src(paths.css)
    .pipe(sass({includePaths: ['node_modules/material-design-lite/src', 'node_modules/foundation-sites/scss']})
    .on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dst));
});

gulp.task('watch', () => {
  gulp.watch(paths.html, ['html-hint', 'html-copy', 'doc', 'reload']);
  gulp.watch(paths.js, ['js-lint', 'js-copy', 'doc', 'reload']);
  gulp.watch(paths.css, ['css-lint', 'sass', 'reload']);
  gulp.watch(paths.fonts, ['fonts-copy', 'reload']);
  gulp.watch(paths.json, ['json-copy', 'reload']);
});

gulp.task('connect', () => {
  connect.server({
    root: paths.dst,
    livereload: true,
    port: port
  });
});

gulp.task('default', [
  'js-lint',
  'css-lint',
  'html-hint',
  'css-copy',
  'fonts-copy',
  'html-copy',
  'sass',
  'js-copy',
  'json-copy',
  'doc',
  'watch',
  'connect'
]);
