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
### gulpEdge(data[, options])
Returns gulp transformer for edge.js compilation.

#### data
Set the data values.

##### file path
Set the data of the file.

```js
  return gulp.src('edge/*.edge')
    .pipe( gulpEdge('./data.json') )
```

##### directory path
If it is a directory path, set the data that matches the edge.js file name in the directory.

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
results:
```
hello world`
```
#### options
##### ext
Output extension name. Default is "html"

##### views
Directory for load other view files. (edge.js can load other view files with `@layout`, `@component` keyword.)

##### path
An alias for `views`.

##### globals
Add global function or variable.

##### tags
Add custom tags.

#### refresh
If this value is true, import new data from the path without cache. Default is `false`.

## License
MIT
