const through = require('through2')
const PluginError = require('plugin-error')
const replaceExt = require('replace-ext')
const edge = require('edge.js')
const {resolve, basename, extname} = require('path')
const {silent: resolveFrom} = require('resolve-from')

module.exports = function (ctx, options = {}) {
  return through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-edgejs', 'Streaming not supported!'))
    }

    let userData
    if (typeof ctx === 'string') {
      try {
        userData = require(
          resolveFrom(process.cwd(), ctx) ||
          resolveFrom(process.cwd(), resolve(ctx, basename(file.path, extname(file.path))))
        )
      } catch (err) {
        userData = {}
      }
    } else {
      userData = Object.assign({}, ctx, file.data)
    }

    edge.registerViews(options.path || file.base)
    file.path = replaceExt(file.path, '.' + (options.ext || 'html'))

    if (options.globals) {
      Object.entries(options.globals).forEach(([key, val]) => edge.global(key, val))
    }

    try {
      file.contents = Buffer.from(edge.renderString(file.contents.toString(), userData))
    } catch (err) {
      return cb(new PluginError('gulp-edgejs', err, {fileName: file.path}))
    }

    cb(null, file)
  })
}
