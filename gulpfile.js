const browserSync = require('browser-sync');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const webpack = require('gulp-webpack');

const PORT = process.env.PORT || 3000;

const reload = () => {
    browserSync.reload();
};

gulp.task('browsersync', () => {
    browserSync.init(null, {
        files: ['app.js', 'views/**/*.*', 'public/**/*.*', 'routes/**/*.*', 'models/**/*.*', 'sources/**/*.*'],
        proxy: `http://localhost:8080`,
        port: PORT,
        open: false,
        notify: false,
    });
});

gulp.task('serve', ['browsersync'], () => {
    nodemon({
        script: './bin/www',
        ext: 'js pug',
        ignore: [
            'node_modules',
            'bin',
            'views',
            'public',
            'sources'
        ],
        env: {
            'NODE_ENV': process.env.NODE_ENV || 'development',
            'PORT': '8080',
            'DEBUG': 'ppark-demo-simple:*',
            'NODE_PATH': '.',
        },
        stdout: false
    }).on('readable', function() {
        this.stdout.on('data', (chunk) => {
            if(/^Express\ server\ listening/.test(chunk)) {
                reload();
            }
            process.stdout.write(chunk);
        });
        this.stderr.on('data', (chunk) => {
            process.stderr.write(chunk);
        });
    });
});

gulp.task('webpack', () => {
    gulp.src('')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('watch', () => {
    watch('./sources/scripts/**/*', () => {
        gulp.start('webpack');
        reload();
    });
});

gulp.task('dev', ['serve', 'webpack', 'watch']);
