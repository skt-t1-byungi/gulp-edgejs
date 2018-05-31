import test from 'ava'
import gulpEdge from '..'
import through from 'through2'
import vfs from 'vinyl-fs'
import path from 'path'

function escape (str) {
  return (Array.isArray(str) ? str[0] : str)
    .trim()
    .replace(/(^\s+)|(\s+$)|\r?\n|\r/gm, '')
}

function template (name, data, options) {
  return vfs.src(path.join(__dirname, 'templates', name + '.edge'))
    .pipe(gulpEdge(data, options))
    .pipe(through.obj((file, enc, cb) => {
      file.output = escape(file.contents.toString())
      cb(null, file)
    }))
}

test.cb('basic', t => {
  template('basic', { name: 'byungi' })
    .on('data', file => {
      t.is(file.output, '<h1>hello byungi</h1>')
      t.regex(file.path, /\.html$/)
      t.end()
    })
})

test.cb('include, partial', t => {
  const expect = escape`
  <h1>
    <div>include test</div>
  </h1>`

  template('include')
    .on('data', file => {
      t.is(file.output, expect)
      t.end()
    })
})

test.cb('layout, section', t => {
  const expect = escape`
  <aside>
    <p>default</p>
    <p>sidebar</p>
  </aside>
  <div class="content">
    <p>content</p>
  </div>`

  template('section')
    .on('data', file => {
      t.is(file.output, expect)
      t.end()
    })
})

test.cb('globals', t => {
  const expect = escape`
  <h1>4</h1>
  <h1>1</h1>`

  const globals = { sum: (a, b) => a + b, test: 1 }

  template('globals', null, {globals})
    .on('data', file => {
      t.is(file.output, expect)
      t.end()
    })
})

test.cb('path data', t => {
  template('pathData', path.resolve(__dirname, 'data/pathData.js'))
    .on('data', file => {
      t.is(file.output, '<h1>value : test</h1>')
      t.end()
    })
})

test.cb.only('dir data', t => {
  template('pathData', path.resolve(__dirname, 'data'))
    .on('data', file => {
      t.is(file.output, '<h1>value : test</h1>')
      t.end()
    })
})
