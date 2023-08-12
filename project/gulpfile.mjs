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
import postcss from 'gulp-postcss';
import htmlmin from 'gulp-htmlmin';
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import zip from 'gulp-zip';

const filePath ={
  sass: "./src/sass/**/*.scss",
  less: "./src/less/styles.less",
  js: "./src/js/**/*.js",
  images: "./src/img/**/*.+(png|jpg|gif|svg)",
  html: "./html/**/*.kit"

}
// Sass and Less
export function stylesTask() {
  var plugin = [autoprefixer()];
  return (    
      gulp      
          .src([filePath.sass, "!./src/sass/widget.scss"])
          .pipe(sourcemaps.init())         
          .pipe(postcss(plugin))        
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
            .src([filePath.less])
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
            .pipe(babel({
              presets: ['@babel/env']
            }))
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
            .src(filePath.images)
            .pipe(cache(imagemin()))
            .pipe(gulp.dest("./dist/img/"))
    );
}
// HTML kit templating
export function kitTask() {
  return gulp
    .src(filePath.html)
    .pipe(kit())    
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
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
          filePath.sass, 
          filePath.html, 
          filePath.less, 
          filePath.js,
          filePath.images
        ],
        gulp.parallel(stylesTask, lessTask, javascriptTask, imageminTask, kitTask))
      .on("change", function (path) {
          console.log("File " + path + " was changed. Reloading...");
          browserSync.reload();
      });
}

export function clearCacheTask() {
  return cache.clearAll()
}
// Gulp default command
export default gulp.series(gulp.parallel(clearCacheTask,stylesTask, lessTask, javascriptTask, imageminTask, kitTask), watch);

// Zip project

export function zipTask() {
  return (
    gulp.src(["./**/*","!./node_modules/**/*"])
      .pipe(zip("project.zip"))
      .pipe(gulp.dest("./"))
  )
}