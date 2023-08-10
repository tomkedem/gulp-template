const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const less = require('gulp-less');
const path = require('path');
// Sass and Less

gulp.task("styles", function(done){
   return (
    gulp
        .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
        // *.scss - all files at the end of the path
        // **/*.scss - match all files at the end of the path plus all children and folders
        // !*.scss or !**/*.scss - exclude the matcing expressions
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/css"))
        .on('end', done) // Call done() when the task is finished
   );
});

gulp.task("less", function(done) {
    return (
      gulp
        .src(["./less/**/*.less"])
        .pipe(sourcemaps.init())
        .pipe(less({
          paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/css"))
        .on('end', done) // Call done() when the task is finished
    );
  });
  
// Watch task with BrowserSync

gulp.task("watch", gulp.series("styles", function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    browser: ["chrome"]
  });
  gulp
    .watch(["./src/sass/**/*.scss", "**/*.html"], gulp.series("styles"))
    .on("change", function (path) {
      console.log("File " + path + " was changed. Reloading...");
      browserSync.reload();
    });
}));

gulp.task('default', gulp.series('watch'));
