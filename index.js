const through = require('through2')
const PluginError = require('plugin-error')
const replaceExt = require('replace-ext')
const edge = require('edge.js')
const { resolve, basename, extname } = require('path')
const { silent: resolveFrom } = require('resolve-from')
const importFresh = require('import-fresh')

module.exports = function (data, opts = {}) {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) return cb(null, file)

        if (file.isStream()) return cb(new PluginError('gulp-edgejs', 'Streaming not supported!'))

        if (opts.globals) Object.entries(opts.globals).forEach(([key, val]) => edge.global(key, val))

        if (Array.isArray(opts.tags)) opts.tags.forEach((tag) => edge.tag(tag))

        if (typeof data === 'string') {
            const cwd = process.cwd()
            const load = opts.refresh ? importFresh : require
            try {
                data = load(
                    resolveFrom(cwd, data) ||
                    resolveFrom(cwd, resolve(data, basename(file.path, extname(file.path))))
                )
            } catch (err) {
                data = {}
            }
        } else {
            data = Object.assign(Object(data), file.data)
        }

        edge.registerViews(opts.views || opts.path || file.base)
        file.path = replaceExt(file.path, opts.ext === '' ? '' : '.' + (opts.ext || 'html'))

        try {
            file.contents = Buffer.from(edge.renderString(String(file.contents), data))
        } catch (err) {
            return cb(new PluginError('gulp-edgejs', err, { fileName: file.path }))
        }

        cb(null, file)
    })
}
