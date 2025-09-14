import gulp from "gulp"

gulp.task('copy-dts', () => {
    return gulp.src('src/**/*.d.ts') 
      .pipe(gulp.dest('dist/built')); 
  });

