# gulp-edgejs
> Edge.js(http://edge.adonisjs.com) template engine plugin 
[![npm](https://img.shields.io/npm/v/gulp-edgejs.svg?style=flat-square)](https://www.npmjs.com/package/gulp-edgejs)
[![npm](https://img.shields.io/npm/dt/gulp-edgejs.svg?style=flat-square)](https://www.npmjs.com/package/gulp-edgejs)

## Install
```sh
yarn add gulp-edgejs
```

## Usage
### Basic
```js
const gulp = require('gulp');
const edge = require('gulp-edgejs');

gulp.task('edge', ()=>{
  return gulp.src('./index.edge')
    .pipe(edge())
    .pipe(gulp.dest('./build'));
});
```

### Variable
```html
<div>hello {{ name }}</div>
```
```js
gulp.task('edge', ()=>{
  return gulp.src('./hello.edge')
    .pipe( edge({ name: 'byungi' }) )
    .pipe(gulp.dest('./build'));
});
```
output:
```html
<div>hello byungi</div>
```

## API
### edge(data?: object, path?: string)
Returns tranform for edge.js compilation.

#### data
Set the variable value.

#### path
Registers the views path to load views. Path must be absolute.

## License
MIT