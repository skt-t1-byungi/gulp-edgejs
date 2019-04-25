import test from 'ava'
import gulpEdge from '..'
import through from 'through2'
import vfs from 'vinyl-fs'
import path from 'path'

const template = (fileName, data, opts) => new Promise(resolve => {
    vfs.src(path.join(__dirname, `templates/${fileName}.edge`))
        .pipe(gulpEdge(data, opts))
        .pipe(through.obj(file => {
            file.output = e(file.contents.toString())
            resolve(file)
        }))
})

test('basic', async t => {
    const file = await template('basic', { name: 'byungi' })
    t.is(file.output, '<h1>hello byungi</h1>')
    t.regex(file.path, /\.html$/)
})

test('include, partial', async t => {
    const file = await template('include')
    t.is(file.output, e`
<h1>
    <div>include test</div>
</h1>`)
})

test('layout, section', async t => {
    const file = await template('section')
    t.is(file.output, e`
<aside>
    <p>default</p>
    <p>sidebar</p>
</aside>
<div class="content">
    <p>content</p>
</div>`)
})

test('globals', async t => {
    const globals = { sum: (a, b) => a + b, test: 1 }
    const file = await template('globals', null, { globals })
    t.is(file.output, e`
<h1>4</h1>
<h1>1</h1>`)
})

test('path data', async t => {
    const file = await template('pathData', path.resolve(__dirname, 'data/pathData.js'))
    t.is(file.output, '<h1>value : test</h1>')
})

test('dir data', async t => {
    const file = await template('pathData', path.resolve(__dirname, 'data'))
    t.is(file.output, '<h1>value : test</h1>')
})

function e (str) {
    return (Array.isArray(str) ? str[0] : str).replace(/(^\s+)|(\s+$)|\r?\n|\r/gm, '')
}
