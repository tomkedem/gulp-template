const gulp =  require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const browserSync =require("browser-sync").create();

// Saas

gulp.task("sass", function(done){
   return gulp
        .src(['./src/sass/**/*.scss','!./src/sass/widget.scss'])
        // *.scss - all files at the end of the path
        // **/*.scss - match all files at the end of the path plus all children and folders
        // !*.scss or !**/*.scss - exclude the matcing expressions
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/css"))
        .on('end', done); // Call done() when the task is finished
    done();
})

// Watch task with BrowserSync

gulp.task("watch",function(){
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: ["chrome"]
    });
    gulp
    .watch(["./src/sass/**/*.scss","**/*.html"], gulp.series("sass")) 
     .on("change", browserSync.reload)
});

gulp.task('default', gulp.series('watch'));
