# gulp-edgejs
Edge.js(http://edge.adonisjs.com) template engine plugin

## Install
```sh
yarn add gulp-edgejs
```

## Usage
### Basic
```js
const gulp = require('gulp');
const edge = require('gulp-edge');

gulp.task('edge', ()=>{
  return gulp.src('./index.edge')
    .pipe(edge())
    .pipe(gulp.dest('./build'));
});
```

### API
### edge(data?: object, path?: string)
Returns tranform for edge.js compilation.

#### data
Set the variable value.

#### path
Registers the views path to load views. Path must be absolute.

## License
MIT