const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const less = require('gulp-less');
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
//const imagemin = require("gulp-imagemin");

const path = require('path');
// Sass and Less

gulp.task("styles", function(){
   return (
    gulp
        .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
        // *.scss - all files at the end of the path
        // **/*.scss - match all files at the end of the path plus all children and folders
        // !*.scss or !**/*.scss - exclude the matcing expressions
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssnano())
        .pipe(sourcemaps.write("."))
        .pipe(rename(function(path){
          if(!path.extname.endsWith(".map")){
            path.basename += ".min"
          }            
        }))
        .pipe(gulp.dest("./dist/css"))
        // .on('end', done) // Call done() when the task is finished
   );
});

//Less

gulp.task("less", function() {
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
  });
  
// Javascript

gulp.task("javascript", function(){
  return(
   // gulp.src("./src/js/**/*.js")
    gulp  
      .src(["./src/js/alert.js","./src/js/project.js"])
      .pipe(concat("project.js"))
      .pipe(uglify())
      .pipe(rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest("./dist/js"))     
  )
})

// Image optimization
// gulp.task("imagemin", function(done){
//   return (
//     gulp.src("./src/img/**/*.+(png|jpg|gif|svg")
//     .pipe(imagemin())
//     .pipe(gulp.dest("./dist/img/"))
    
//   )
// })

// Watch task with BrowserSync

gulp.task("watch", gulp.series(["styles", "less","javascript"], function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    browser: ["chrome"]
  });
  gulp
    .watch(
        ["./src/sass/**/*.scss", "**/*.html","./src/less/styles.less","./src/js/**/*.js"], 
        gulp.series(["styles", "less","javascript"])
      )
    .on("change", function (path) {
      console.log("File " + path + " was changed. Reloading...");
      browserSync.reload();
    });
}));

gulp.task('default', gulp.series('watch'));
