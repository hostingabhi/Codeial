// import 'graceful-fs';
// import gulp from 'gulp';
// import cssnano from 'gulp-cssnano';
// import rev from 'gulp-rev';
// import imagemin from 'gulp-imagemin';
// // import { dest } from 'gulp'; // Added this line to import 'dest'
// import * as del from 'del';
// import dartSass from 'gulp-dart-sass'; // Imported dartSass
// const { dest } = gulp;

// function compileSass() {
//     console.log('minifying css...');
//     return gulp.src('./assets/sass/**/*.scss')
//         .pipe(dartSass().on('error', dartSass.logError)) // Use dartSass() instead of sass()
//         .pipe(cssnano())
//         .pipe(gulp.dest('./public/assets'))
//         .pipe(rev())
//         .pipe(dest('./public/assets')) // Use imported dest
//         .pipe(rev.manifest({
//             cwd: 'public',
//             merge: true
//         }))
//         .pipe(gulp.dest('./public/assets'));
// }

// gulp.task('css', compileSass);

// gulp.task('js', function() {
//     console.log('minifying js...');
//     return gulp.src('./assets/**/*.js')
//         .pipe(uglify())
//         .pipe(rev())
//         .pipe(gulp.dest('./public/assets'))
//         .pipe(rev.manifest({
//             cwd: 'public',
//             merge: true
//         }))
//         .pipe(gulp.dest('./public/assets'));
// });

// gulp.task('images', function() {
//     console.log('compressing images...');
//     return gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
//         .pipe(imagemin())
//         .pipe(rev())
//         .pipe(gulp.dest('./public/assets'))
//         .pipe(rev.manifest({
//             cwd: 'public',
//             merge: true
//         }))
//         .pipe(gulp.dest('./public/assets'));
// });

// gulp.task('clean:assets', function() {
//     return del.sync('./public/assets');
// });

// gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images', function(done) {
//     console.log('Building assets');
//     done();
// }));


// -------------


// const gulp = require('gulp');
// const cssnano = require('gulp-cssnano');
// const rev = require('gulp-rev');
// const { createRequire } = require('module');


// // Create a 'require' function to load 'sass'
// const myrequire = createRequire(__filename);
// const gulpSass = myrequire('gulp-sass')(myrequire('sass'));
// const uglify = myrequire('gulp-uglify').default
// const minify = require('gulp-minify');


// // minifying the CSS
// gulp.task('css', function (done) {
//     console.log("Minifying css..")
//     gulp.src('./assets/sass/**/*.scss')
//         .pipe(gulpSass())
//         .pipe(cssnano())
//         .pipe(gulp.dest('./assets/css'))
//     gulp.src('./assets/**/*.css')
//         .pipe(rev())
//         .pipe(gulp.dest('./public/assets'))
//         .pipe(rev.manifest({
//             cwd: "public",
//             merge:true
//         }))
//         .pipe(gulp.dest('./public/assets'))
//         done()
// })

// gulp.task('js', function (done) {
//     console.log("Minifying js..")
//     gulp.src('./assets/**/*.js')
//         .pipe(uglify())
//         .pipe(rev())
//         .pipe(gulp.dest('./public/assets'))
//         .pipe(rev.manifest({
//             cwd: "public",
//             merge:true
//         }))
//         .pipe(gulp.dest('./public/assets'))
//         done()
// })

// gulp.task('images', function(done){
//     console.log('compressing images...');
//     gulp.src('./assets/images/**/*.+(PNG|JPG|GIF|SVG|JPEG|png|jpg|gif|svg|jpeg)')
//     .pipe(minify())
//     .pipe(rev())
//     .pipe(gulp.dest('./public/assets/images'))
//     .pipe(rev.manifest({
//         cwd: 'public',
//         merge: true
//     }))
//     .pipe(gulp.dest('./public/assets/images'));
//     done();
// });

// const del = require('del');
// gulp.task('clean:assets', async function () {
//     await del('./public/assets')
// })

// gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function () {
//     console.log("Building assets")
// })


// -------------------

const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const { createRequire } = require('module');

// Create a 'require' function to load 'sass'
const myrequire = createRequire(__filename);
const gulpSass = myrequire('gulp-sass')(myrequire('sass'));
const uglify = myrequire('gulp-uglify-es').default;
const { exec } = require('child_process');

function cleanAssets() {
    return new Promise((resolve, reject) => {
        exec('rm -rf ./public/assets', (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

gulp.task('clean:assets', cleanAssets);


// minifying the CSS
gulp.task('css', function (done) {
    console.log("Minifying css..")
    gulp.src('./assets/sass/**/*.scss')
        .pipe(gulpSass())
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css'))
    gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: "public",
            merge:true
        }))
        .pipe(gulp.dest('./public/assets'))
        done()
})

gulp.task('js', function (done) {
    console.log("Minifying js..")
    gulp.src('./assets/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: "public",
            merge:true
        }))
        .pipe(gulp.dest('./public/assets'))
        done()
})

gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/images/**/*.+(PNG|JPG|GIF|SVG|JPEG|png|jpg|gif|svg|jpeg)')
    .pipe(uglify()) // Assuming you want to minify images
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/images'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets/images'));
    done();
});

gulp.task('clean:assets', async function () {
    await del('./public/assets')
})

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function () {
    console.log("Building assets")
})
