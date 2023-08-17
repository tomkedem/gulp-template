import gulp from 'gulp';
const { parallel } = gulp;
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
import {deleteAsync} from 'del';
import plumber from 'gulp-plumber';
import notifier from 'gulp-notifier';

notifier.defaults({
  message:{
    sass: "CSS was successfully compiled!",
    js: "Javascript is ready!",
    kit: "Html was delivered!"
  },
  prefix: "====",
  suffix: "====",
  exclusios:".map"
})

const filePath ={
  sass: "./src/sass/**/*.scss",
  less: "./src/less/styles.less",
  js: "./src/js/**/*.js",
  images: "./src/img/**/*.+(png|jpg|gif|svg)",
  html: "./html/**/*.kit"

}
// stylesTask and Less

export function stylesTask() {
  var plugin = [autoprefixer()];
  return (    
      gulp      
          .src([filePath.sass, "!./src/sass/widget.scss"])
          .pipe(plumber({errorHandler: notifier.error }))
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
          // .pipe(notifier.success("sass"))
  );
}

// Less

export function lessTask() {
    return (
        gulp
            .src([filePath.less])
            .pipe(plumber({errorHandler: notifier.error }))
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
            .pipe(plumber({errorHandler: notifier.error }))
            .pipe(babel({
              presets: ['@babel/env']
            }))
            .pipe(concat("project.js"))
            .pipe(uglify())
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("./dist/js"))
            // .pipe(notifier.success("js"))
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
          .pipe(plumber({errorHandler: notifier.error }))
          .pipe(kit())    
          .pipe(htmlmin({
            collapseWhitespace: true
          }))
          .pipe(gulp.dest("./"))
          // .pipe(notifier.success("kit"))
    
}

// Watch task with BrowserSync
export function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    browser: ["chrome"]
  });

  gulp.watch(filePath.sass, gulp.task("stylesTask")).on("change", browserSync.reload);
  gulp.watch(filePath.less, gulp.task("lessTask")).on("change", browserSync.reload);
  gulp.watch(filePath.html, gulp.task("kitTask")).on("change", browserSync.reload);
  gulp.watch(filePath.js, gulp.task("javascriptTask")).on("change", browserSync.reload);
  gulp.watch(filePath.images, gulp.task("imageminTask")).on("change", browserSync.reload);
}


export function clearCacheTask() {
  return cache.clearAll()
}

// Zip project

export function zipTask() {
  return (
    gulp.src(["./**/*","!./node_modules/**/*"])
      .pipe(zip("project.zip"))
      .pipe(gulp.dest("./"))
  )
}

// Cleam "dist" folder

export function cleanDistTask() {
  return (
    deleteAsync(["./dist/**/*"])
  )
}

// Gulp serve

export const build = parallel(clearCacheTask,stylesTask, lessTask, javascriptTask, imageminTask, kitTask);

// Gulp default command
export default gulp.series(build, watch);
