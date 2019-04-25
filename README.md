# gulp-edgejs
> Edge.js(http://edge.adonisjs.com) template engine

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
const gulpEdge = require('gulp-edgejs');

gulp.task('edge', ()=>{
  return gulp.src('./index.edge')
    .pipe( gulpEdge() )
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
    .pipe( gulpEdge({ name: 'byungi' }) )
    .pipe(gulp.dest('./build'));
});
```
output:
```html
<div>hello byungi</div>
```

## API
### gulpEdge(data?: object|string, options?: object)
Returns gulp tranform for edge.js compilation.

#### data
Set the variable value.

##### Data path
If it is a data path, inject the file data.
###### Exmaple
```js
  return gulp.src('edge/*.edge')
    .pipe( gulpEdge('data/') )
```
`edge/main.edge`
```
hello {{ value }}
```
`data/main.js`
```js
export.value = 'world'
```
results `hello world`.

#### options
##### ext
The ext name to change. defaults "html"

##### path
Registers the views path to load views. Path must be absolute.

##### globals
Add global functions or variables.

##### tags
Add custom tags array.

## License
MIT