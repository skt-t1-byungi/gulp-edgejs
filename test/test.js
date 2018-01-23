import test from 'ava'
import gulpEdge from '..'
import through from 'through2'
import vfs from 'vinyl-fs'
import path from 'path'

function template (name, data) {
  return vfs.src(path.join(__dirname, 'templates', name + '.edge'))
    .pipe(gulpEdge(data))
    .pipe(through.obj((file, enc, cb) => {
      file.output = file.contents.toString().trim().replace(/\s+$/gm, '')
      cb(null, file)
    }))
}

test.cb('basic', t => {
  template('basic', { name: 'byungi' })
    .on('data', file => {
      t.is(file.output, '<h1>hello byungi</h1>')
      t.end()
    })
})

test.cb('include, partial', t => {
  const expect = `
<h1>
<div>include test</div>
</h1>
`.trim()

  template('include')
    .on('data', file => {
      t.is(file.output, expect)
      t.end()
    })
})

test.cb('layout, section', t => {
  const expect = `
<aside>
  <p>default</p>
  <p>sidebar</p>
</aside>
<div class="content">
  <p>content</p>
</div>
`.trim()

  template('section')
    .on('data', file => {
      t.is(file.output, expect)
      t.end()
    })
})
