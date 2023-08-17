# The watch file take care only when some change occur ond only with the right file



# Comments Start

1. Gulp APIs:

    gulp.task("task_name", function_or_api) - Allows to set up a task with the name and the function/API that would return something
    -------------------------
    gulp.src("glob_pattern") - Allows to set the path to the source files with the help of a glob pattern
    -------------------------
    gulp.pipe() - Adds additional step to the task. Inside you can execute a plugin.
    -------------------------
    gulp.dest("glob_pattern") - Allows to set the ouptup path with the help of a glob pattern
    -------------------------
    gulp.watch(["glob_pattern"], tasks_to_be_executed) - Watches for the globs changes and runs the tasks after a change has occured
    -------------------------
    gulp.series(["name_of_the_task"]) - Allows to execute tasks in a sequential, strict order. Use it when the order is important
    -------------------------
    gulp.parallel(["name_of_the_task"]) - Allows to execute tasks simultaneously. Use it when the order is not important

2. Globs:

    Glob - a string of literal and/or wildcard characters used to match filepaths.

 # *.file_name_extension (e.g. "scripts/*.js") - matches all the files within one directory. Children files and folders are not included
--------------------------------------

 # **/*.file_name_extension (e.g. "scripts/**/*.js") - matches all the files within one directory, INCLUDING all the children folders and files

--------------------------------------
 # !full_file_or_folder_name (e.g. "!main.scss" or "!node_modules/**") - negative glob. Excludes file/files and folders. Use it only after the positive globs


3. Gulp workflow:

  1) Find a plugin with the help of the browser: gulp feature_name

  2) Install the plugin’s package: npm install gulp-uglify --save-dev
  
  3) Import the plugin’s package to the gulpfile.js: 
  
      const variable_name = require("gulp_plugin-name");

  4) Create a basic task:

        export function "task_name"() {
            return (
               
            )
        }     

  5) Use the "gulp.src" method to specify a glob for the source files in the task:

      gulp.src("glob_pattern")

  6) Add additional steps to the task with the ".pipe" method:

      .pipe()

  7) Execute the plugin and provide additional options if they are required or needed:

      .pipe(rename("./styles.min.css"))

  8) Use the "gulp.dest" method to specify the output directory for the files in the task:

      gulp.dest("/dist/")

  9) Set the "gulp.watch" task in order to track the globes and execute tasks upon any changes

  10) Use the "gulp.series" method when you want to execute tasks in the sequential, strict order:

      gulp.series(build, watch)

  11) Use the "gulp.parallel" method when you want to execute tasks simultaneously:

      gulp.parallel(sass, less, imagemin, html)

-----------------------------------------------------------

# Comments End 