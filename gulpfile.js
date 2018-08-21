const gulp = require('gulp');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('autoprefixer');
const plugins = require('gulp-load-plugins')();
  
gulp.task('scss', () => {
  return gulp
    .src('./stylesheets/sp/main.scss')
    .pipe(plugins.sassGlob())
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.postcss([autoprefixer({ browsers: ['last 4 versions', 'ie >= 11'] })]))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('./stylesheets/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
