import gulp from "gulp";
import sass from 'gulp-dart-sass';
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import less from 'gulp-less';
import cssnano from "gulp-cssnano";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import cache from "gulp-cache";



// Sass and Less
export function styles() {
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

// JavaScript

export function javascript() {
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
          "**/*.html", 
          "./src/less/styles.less", 
          "./src/js/**/*.js",
          "./src/img/**/*.+(png|jpg|gif|svg)"
        ],
        gulp.series(styles, lessTask, javascript, imageminTask))
      .on("change", function (path) {
          console.log("File " + path + " was changed. Reloading...");
          browserSync.reload();
      });
}

export function clearCacheTask() {
  return cache.clearAll()
}
// Gulp default command
export default gulp.series(gulp.parallel(styles, lessTask, javascript, imageminTask), watch);