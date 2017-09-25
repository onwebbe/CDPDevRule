var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var notify  = require("gulp-notify");
var eslint  = require('gulp-eslint');
var rename  = require('gulp-rename');
var config = require("config");

var rootPath = config.get("rootPath");
var serverRoot = rootPath + "tomcat-sfs/webapps/ROOT/ui/";
var configFile = __dirname + config.get("eslintConfig");
var msgs = "";

var allTasks = [];
var monitorModules = config.get("monitorModules");

for(let i = 0; i < monitorModules.length; i ++) {
    let modulePath = monitorModules[i].path;
    console.log(rootPath + modulePath);
    allTasks.push("watchjs" + i);
    gulp.task('watchjs' + i, function(){
        gulp.watch(rootPath + modulePath + '**/*.js')
        .on("change", function(file) {
          gulp
            .src(file.path, {
                base: rootPath + modulePath
            })
            .pipe(plumber())
            .pipe(eslint(configFile))
            .pipe(eslint.format())
            .pipe(eslint.result(result => {
                    // Called for each ESLint result.
                    var args = Array.prototype.slice.call(arguments);
                    let filePath = result.filePath;
                    filePath = filePath.substring(filePath.lastIndexOf("/") + 1);
                    msgs = "";
                    msgs += `path: ${filePath} : `;
                    msgs += `err: ${result.errorCount} : `;
                    msgs += `war: ${result.warningCount} : `;
                    /*msgs += `msg: ${result.messages.length} : `;*/
                    /*notify.onError({
                        title: 'esLint error, please check error log',
                        message: msgs
                    }).apply(this, args);//替换为当前对象*/
                }))
            .pipe(eslint.failAfterError())
            .on("error", function(){
                var args = Array.prototype.slice.call(arguments);

                notify.onError({
                    title: 'esLint error',
                    /*message: '<%=error.message %>'*/
                    message: msgs
                }).apply(this, args);//替换为当前对象
                this.emit();//提交
            })
            .pipe(rename({ suffix: '_dev-snapshot' }))
            .pipe(gulp.dest(serverRoot));
      });
    });

    allTasks.push("watchcss" + i);
    gulp.task('watchcss' + i, function(){
        gulp.watch(rootPath + modulePath + '**/*.css')
        .on("change", function(file) {
          gulp.src(file.path, {
                base: rootPath + modulePath
            })
            .pipe(rename({ suffix: '_dev-snapshot' }))
            .pipe(gulp.dest(serverRoot));
      });
    });

    allTasks.push("watchpages" + i);
    gulp.task('watchpages' + i, function(){
        gulp.watch(rootPath + modulePath + '**/*.xhtml')
        .on("change", function(file) {
          gulp.src(file.path, {
                base: rootPath + modulePath
            })
            .pipe(gulp.dest(serverRoot));
      });
    });
}


gulp.task('default', allTasks);