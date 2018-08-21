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

gulp.task('sprite', () => {
  return gulp
    .src('./images/icons/svg/*.svg')
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({ inlineSvg: true }))
    .pipe(plugins.cheerio({
      run: ($, file) => {
        $('style,title,defs').remove();
        $('[id]:not(symbol)').removeAttr('id');
        $('[class^="st"],[class^="cls"]').removeAttr('class');
        $('[style]:not(svg)').removeAttr('style');
        $('[data-name]').removeAttr('data-name');
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('svg').attr({
          style: 'display:none'
        });
        const symbols = $('svg > symbol').map(function () {
          return {
            id: $(this).attr('id')
          };
        }).get();

        //確認ページ作成
        gulp
          .src('./images/src/_template.html')
          .pipe(plugins.template({
            inlineSvg: $('svg'),
            symbols: symbols
          }))
          .pipe(plugins.rename('_svg-icons.html'))
          .pipe(gulp.dest('./images/src'))
          .pipe(plugins.preprocess())
          .pipe(gulp.dest('./images/src'));
      },
      //これがないと属性が全部小文字に
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(plugins.rename('sprite.min.svg'))
    .pipe(gulp.dest('./images/src'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./stylesheets/**/*.scss', ['sass']);
});
