var gulp = require("gulp");
var glob = require("glob");
var $ = require("gulp-load-plugins")();
var browserify = require("browserify");
var watchify = require("watchify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/**/*.html'],
    img: ['src/assets/img/*.{png,jpg,jpng,gif}', 'src/*.ico'],
    assets: ['src/assets/music/*.{mp3,wav}'],
    scss: ['src/assets/*.scss']
};


var watchedBrowserify = watchify(browserify('src/main.ts', {
    basedir: '.',
    debug: true,
    //entries: glob.sync('src/{assets/*.scss,*.ts}'),
    //entries: "src/main.ts",
    cache: {},
    packageCache: {}
}).plugin(tsify));


gulp.task("glob", function(cb) {
    console.log(glob.sync('./src/{assets/*.scss,*.ts}'));
    cb();
});

gulp.task('fonts', function() {
    return gulp.src('./node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/assets/fonts'))
})

gulp.task("copy-html", function() {
    return gulp.src(paths.pages.concat(paths.img), { base: "./src" })
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-assets", function() {
    return gulp.src(paths.assets, { base: "./src" })
        .pipe(gulp.dest("dist"));
});

function sass() {
    return gulp.src(paths.scss, { base: 'src' })
        .pipe($.sass().on("error", $.sass.logError))
        .pipe(gulp.dest("dist"));
}

gulp.task("sass", function() {
    return sass();
});

function watchSass() {
    return $.watch(paths.scss, function() {
        console.log("sass changed");
        sass();
    })
}

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("bundle", function() {
    return bundle();
});

gulp.task("compileOthers", function() {});

function updateInfp() {
    watchSass();
    watchedBrowserify.on("update", bundle);
    watchedBrowserify.on("log", $.util.log);
}
gulp.task("serve", gulp.series("copy-html", "copy-assets", "sass", "bundle", updateInfp)); //实时编译

gulp.task("build", gulp.series("copy-html", "copy-assets", "sass", function buildCb() { //打包
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest("dist"));
}));

gulp.task("default", gulp.series("build", function defaultCb(cb) {
    cb();
}));