let project_folder = "dist",
    source_folder = "website";

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/assets/css',
        js: project_folder + '/assets/js',
        img: project_folder + '/assets/images',
        fonts: project_folder + '/assets/fonts'
    },
    src: {
        html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
        css: source_folder + '/assets/scss/style.scss',
        js: source_folder + '/assets/js/script.js',
        img: source_folder + '/assets/images/**/*.{jpg,png,svg,gif,ico,webp,webm}',
        fonts: source_folder + '/assets/fonts/*.ttf'
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/assets/scss/**/*.scss',
        js: source_folder + '/assets/js/**/*.js',
        img: source_folder + '/assets/images/**/*.{jpg,png,svg,gif,ico,webp,webm}',
        fonts: source_folder + '/assets/fonts/*.ttf'
    },
    clean: "./" + project_folder + "/"
}

const { src, dest } = require('gulp');
let gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    groupmedia = require('gulp-group-css-media-queries'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin');

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder
        },
        port: 3000,
        notify: false
    })
}

function css() {
    return src(path.src.css)
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(groupmedia())
        .pipe(dest(path.build.css))

        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function img() {
    return src(path.src.img)
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}


function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], img);
}

function clean(params) {
    return del(path.clean);
}

gulp.task('icons:build', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest(project_folder + '/assets/webfonts/'));
});

let build = gulp.series(gulp.parallel(js, html, css, img));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;