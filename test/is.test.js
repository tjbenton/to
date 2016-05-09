import test from 'tape'
import is from '../src/is.js'

const string = 'yo this is a string one two three'
const array = [ 'one', 'two', 'three' ]
const object = { one: 1, two: 2, three: 3 }

test('is.plainObject', (t) => {
  t.ok(is.plainObject({}), 'should be a plain object aka `{}`')
  t.ok(!is.plainObject(1), "shouldn't be a plain object")
  t.ok(!is.plainObject(false), "shouldn't be a plain object")
  t.ok(!is.plainObject(true), "shouldn't be a plain object")
  t.ok(!is.plainObject([]), "shouldn't be a plain object")
  t.end()
})

test('is.in', (s) => {
  s.test('is.in', (t) => {
    for (let i = 0; i < array.length; i++) {
      let item = array[i]
      t.ok(is.in(array, item))
      t.ok(!is.in(array, item + 'z'))
      t.ok(is.in(object, item))
      t.ok(!is.in(object, item + 'z'))
      t.ok(is.in(string, item))
      t.ok(!is.in(string, item + 'z'))
    }

    t.end()
  })

  s.test('is.all.in', (t) => {
    const fake = array.map((item) => item + 'z')
    const tests = [ array, object, string ]
    for (var i = 0; i < tests.length; i++) {
      if (!is.all.in(tests[i], ...array) || is.all.in(tests[i], ...fake)) {
        t.fail('something went wrong with `is.all.in`')
        t.end()
        return
      }
    }
    t.pass('is.all.in')
    t.end()
  })

  s.test('is.any.in', (t) => {
    const fake = array.map((item) => item + 'z')
    const tests = [ array, object, string ]
    for (var i = 0; i < tests.length; i++) {
      if (!is.any.in(tests[i], array[i]) || is.any.in(tests[i], fake[i])) {
        t.fail('something went wrong with `is.any.in`')
        t.end()
        return
      }
    }
    t.pass('is.any.in')
    t.end()
  })

  s.end()
})