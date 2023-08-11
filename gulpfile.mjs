import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import less from 'gulp-less';
import cssnano from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import cache from 'gulp-cache';
import kit from 'gulp-kit';

// Sass and Less
export function stylesTask() {
  return (
      gulp
          .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(cssnano())
          .pipe(sourcemaps.write("."))
          .pipe(rename((path) => {
              if (!path.extname.endsWith(".map")) {
                  path.basename += ".min";
              }
          }))
          .pipe(gulp.dest("./dist/css"))
  );
}

// Less

export function lessTask() {
    return (
        gulp
            .src(["./src/less/styles.less"])
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(cssnano())
            .pipe(sourcemaps.write("."))
            .pipe(rename("./styles.min.css"))
            .pipe(gulp.dest("./dist/css"))
    );
}

// javascript

export function javascriptTask() {
    return (
        gulp
            .src(["./src/js/alert.js", "./src/js/project.js"])
            .pipe(concat("project.js"))
            .pipe(uglify())
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("./dist/js"))
    );
}

// Image optimization
export function imageminTask() {
    return (
        gulp
            .src("./src/img/**/*.+(png|jpg|gif|svg)")
            .pipe(cache(imagemin()))
            .pipe(gulp.dest("./dist/img/"))
    );
}
// HTML kit templating
export function kitTask() {
  return gulp
    .src("./html/**/*.kit")
    .pipe(kit())
    .pipe(gulp.dest("./"));
}

// Watch task with BrowserSync
export function watch() {
  browserSync.init({
      server: {
          baseDir: "./"
      },
      browser: ["chrome"]
  });
  gulp
      .watch(
        [
          "./src/sass/**/*.scss", 
          "./html/**/*.kit", 
          "./src/less/styles.less", 
          "./src/js/**/*.js",
          "./src/img/**/*.+(png|jpg|gif|svg)"
        ],
        gulp.series(stylesTask, lessTask, javascriptTask, imageminTask, kitTask))
      .on("change", function (path) {
          console.log("File " + path + " was changed. Reloading...");
          browserSync.reload();
      });
}

export function clearCacheTask() {
  return cache.clearAll()
}
// Gulp default command
export default gulp.series(gulp.parallel(stylesTask, lessTask, javascriptTask, imageminTask, kitTask), watch);