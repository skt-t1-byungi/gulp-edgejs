import test from 'ava'
import gulpEdge from '..'
import vfs from 'vinyl-fs'
import path from 'path'
import assert from 'assert'

function template (name) {
  return vfs.src(path.join(__dirname, 'templates', name + '.edge'))
}

function assertEdge (file, regex) {
  const content = file.contents.toString().replace(/\n/g, '')

  assert.ok(regex.test(content))
}

test.cb('basic', t => {
  template('basic')
    .pipe(gulpEdge({
      data: { name: 'byungi' }
    }))
    .on('data', file => {
      assertEdge(file, /<h1>hello byungi<\/h1>/)
      t.end()
    })
})

test.cb('include', t => {
  template('include')
    .pipe(gulpEdge({
      data: { name: 'byungi' }
    }))
    .on('data', file => {
      assertEdge(file, /<h1>.*?include test.*?<\/h1>/)
      t.end()
    })
})

test.cb('layout, section', t => {
  template('section')
    .pipe(gulpEdge({
      data: { name: 'byungi' }
    }))
    .on('data', file => {
      const regex = /<aside>.*<p>default<\/p>.*<p>sidebar<\/p><\/aside>.*<div class="content">.*<p>content/
      assertEdge(file, regex)
      t.end()
    })
})
