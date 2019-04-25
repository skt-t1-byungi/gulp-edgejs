const through = require('through2')
const PluginError = require('plugin-error')
const replaceExt = require('replace-ext')
const edge = require('edge.js')
const { resolve, basename, extname } = require('path')
const { silent: resolveFrom } = require('resolve-from')
const importFresh = require('import-fresh')

module.exports = function (data, options = {}) {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            return cb(null, file)
        }

        if (file.isStream()) {
            return cb(new PluginError('gulp-edgejs', 'Streaming not supported!'))
        }

        edge.registerViews(options.path || file.base)
        file.path = replaceExt(file.path, '.' + (options.ext || 'html'))

        if (options.globals) {
            Object.entries(options.globals).forEach(([key, val]) => edge.global(key, val))
        }

        if (options.tags) {
            options.tags.forEach((tag) => edge.tag(tag))
        }

        try {
            file.contents = Buffer.from(edge.renderString(file.contents.toString(), resolveUserData(data, file)))
        } catch (err) {
            return cb(new PluginError('gulp-edgejs', err, { fileName: file.path }))
        }

        cb(null, file)
    })
}

function resolveUserData (path, file) {
    if (typeof path !== 'string') return Object.assign({}, Object(path), file.data)

    const cwd = process.cwd()

    let userData
    try {
        userData = importFresh(
            resolveFrom(cwd, path) ||
            resolveFrom(cwd, resolve(path, basename(file.path, extname(file.path))))
        )
    } catch (err) {
        userData = {}
    }

    return Object.assign(userData, file.data)
}
