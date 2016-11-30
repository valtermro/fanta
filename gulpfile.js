/* eslint-env node */
/* eslint-disable no-console, no-shadow */
const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const rmdir = require('rmdir')
const babelConfig = require('./_dev/babel.config')
const $ = require('gulp-load-plugins')()

const pathFromRoot = p => path.join(__dirname, p)

const bundle = name => function bundle() {
  return gulp.src(['./src/**/*.js', '!./src/**/*_test.js'])
    .pipe($.babel(babelConfig[name]))
    .pipe(gulp.dest(name === 'next' ? './next' : '.'))
}

const mocha = (file, fail) => function mocha() {
  const src = file === 'all' ? './src/**/*_test.js' : file
  const stream = gulp.src(src, { read: false })
    .pipe($.mocha({
      reporter: 'progress',
      bail: true,
      require: ['./_dev/babel.register.js'],
    }))

  if (!fail) {
    stream.on('error', (err) => {
      if (!err.__safety)
        return $.util.log(err)
    })
  }

  return stream
}

const eslint = (file, fail) => function eslint() {
  const src = file === 'all' ? './**/*.js' : file
  let stream = gulp.src(src)
    .pipe($.eslint())
    .pipe($.eslint.format())

  if (fail)
    stream = stream.pipe($.eslint.failAfterError())

  return stream
}

const writeIndex = () => function writeIndex(done) {
  const write = (d) => {
    const dir = pathFromRoot(d)
    const contents = fs.readdirSync(dir)
      .filter(f => f[0] !== '_' && f.slice(-8) !== '_test.js')
      .reduce((a, f) => {
        if (f !== 'index.js' && f.slice(-3) === '.js')
          a += `export { default as ${f.slice(0, -3)} } from './${f}'\n` // eslint-disable-line
        return a
      }, '')

    fs.writeFileSync(path.join(dir, 'index.js'), contents)
  }

  write('src')
  write('src/util')

  if (done) done()
}

const readDir = (dir) => {
  return fs.readdirSync(dir)
    .filter(f => f[0] !== '_')
    .map((f) => {
      const file = path.join(dir, f)
      if (f.slice(-3) === '.js')
        return file
      return readDir(file)
    })
    .reduce((a, f) => a.concat(f), [])
}

gulp.task('mocha', mocha('all', false))
gulp.task('eslint', eslint('all', false))

gulp.task('bundle-node', bundle('node'))
gulp.task('bundle-next', bundle('next'))
gulp.task('bundle', gulp.parallel('bundle-node', 'bundle-next'))

gulp.task('test', gulp.parallel(eslint('all', true), mocha('all', true)))
gulp.task('build', gulp.series('test', writeIndex(), 'bundle'))

gulp.task('clear', function clear(done) {
  fs.readdirSync('./')
    .filter(p => !p.match(/^\..+|.+\.(json|md)|^[A-Z]+$|_dev|src|node_modules|gulpfile/))
    .map(pathFromRoot)
    .forEach(p => rmdir(p))
  done()
})

gulp.task('dev', gulp.series(
  writeIndex(),
  function watching() {
    const old = readDir('./src')

    return gulp.watch('./src/**/*.js')
      .on('change', (file) => {
        const basename = path.basename(file)
        if (basename === 'index.js') return

        // run the tests for this file
        const testFile = file.slice(-8) === '_test.js' ? file :
          file.replace(basename.slice(-3), '_test.js')
        const testPath = pathFromRoot(testFile)

        if (fs.existsSync(testPath)) {
          console.log('Running tests for', testPath)
          mocha(testPath, false)()
        }
        eslint(pathFromRoot(file), false)()

        // Update index.js
        if (file[0] !== '_' && old.indexOf(file) < 0) {
          old.push(file)
          writeIndex()()
        }
      })
      .on('unlink', (file) => {
        const basename = path.basename(file)
        if (basename === 'index.js') return

        // Update index.js
        const oldi = old.indexOf(file)
        if (oldi >= 0) {
          writeIndex()()
          old.splice(oldi, 1)
        }
      })
  }
))
