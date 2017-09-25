var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var notify  = require("gulp-notify");
var eslint  = require('gulp-eslint');
var rename  = require('gulp-rename');

var rootPath = "/data/sfsf/workspace/trunk/";
var serverRoot = rootPath + "tomcat-sfs/webapps/ROOT/ui/cdp/";
var configFile = __dirname + '/.eslintrc';
var msgs = "";

gulp.task('default', ['watchjs', 'watchcss', 'watchpages']);

gulp.task('watchjs', function(){
    gulp.watch(rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/js/**/*.js')
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
                title: 'compile error',
                /*message: '<%=error.message %>'*/
                message: msgs
            }).apply(this, args);//替换为当前对象
            this.emit();//提交
        })
        .pipe(rename({ suffix: '_dev-snapshot' }))
        .pipe(gulp.dest(serverRoot + 'js',  {
            base: rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/js/'
        }));
  });
});

gulp.task('watchcss', function(){
    gulp.watch(rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/css/**/*.css')
    .on("change", function(file) {
      gulp
        .src(file.path, {
            base: rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/css/'
        })
        .pipe(rename({ suffix: '_dev-snapshot' }))
        .pipe(gulp.dest(serverRoot + 'css'));
  });
});

gulp.task('watchpages', function(){
    gulp.watch(rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/pages/**/*.xhtml')
    .on("change", function(file) {
      gulp
        .src(file.path, {
            base: rootPath + 'cdp/au-cdp-web/src/main/webapp/ui/cdp/pages/'
        })
        .pipe(gulp.dest(serverRoot + 'pages'));
  });
});