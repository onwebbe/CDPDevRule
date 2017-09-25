var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var notify  = require("gulp-notify");
var eslint  = require('gulp-eslint');
var rename  = require('gulp-rename');
var config = require("config");

var rootPath = config.get("rootPath");
var serverRoot = rootPath + "tomcat-sfs/webapps/ROOT/ui/cdp/";
var configFile = __dirname + config.get("eslintConfig");
var msgs = "";

gulp.task('default', ['watchjs', 'watchcss', 'watchpages']);

gulp.task('watchjs', function(){
    gulp.watch(rootPath + config.get("moduleRoot") + 'js/**/*.js')
    .on("change", function(file) {
      gulp
        .src(file.path, {
            base: rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/js/'
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
        .pipe(gulp.dest(serverRoot + 'js',  {
            base: rootPath + config.get("moduleRoot") + '/js/'
        }));
  });
});

gulp.task('watchcss', function(){
    gulp.watch(rootPath + config.get("moduleRoot") + 'css/**/*.css')
    .on("change", function(file) {
      gulp
        .src(file.path, {
            base: rootPath + config.get("moduleRoot") + '/css/'
        })
        .pipe(rename({ suffix: '_dev-snapshot' }))
        .pipe(gulp.dest(serverRoot + 'css'));
  });
});

gulp.task('watchpages', function(){
    gulp.watch(rootPath + config.get("moduleRoot") + '/pages/**/*.xhtml')
    .on("change", function(file) {
      gulp
        .src(file.path, {
            base: rootPath + config.get("moduleRoot") + '/pages/'
        })
        .pipe(gulp.dest(serverRoot + 'pages'));
  });
});