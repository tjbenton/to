import test from 'tape'
import to from '../src/to.js'
import fs from 'fs-extra'
import promisify from 'es6-promisify'
fs.readFile = promisify(fs.readFile)

import path from 'path'
const string = 'yo this is a string'
const array = [ 'one', 'two', 'three' ]
const object = { one: 1, two: 2, three: 3 }
const buffer = new Buffer(string)
const number = 4
const boolean = false
const file = `${process.cwd()}/test/to.test.js`

test('to.clamp', (t) => {
  t.ok(to.clamp(10, 0, 1) === 1, 'number should be 1')
  t.ok(to.clamp(100, -100) === 100, 'number should be 100')
  t.ok(to.clamp(-100, 0, 1) === 0, 'number should be 0')
  t.ok(to.clamp(-1000, -100) === -100, 'number should be -100')
  t.end()
})


test('to.string', async (t) => {
  t.strictEqual(typeof to.string(string), 'string',
    '`string` should be converted to a typeof string')
  t.strictEqual(typeof to.string(array), 'string',
    '`array` should be converted to a typeof string')
  t.strictEqual(typeof to.string(buffer), 'string',
    '`buffer` should be converted to a typeof string')
  t.strictEqual(typeof to.string(await fs.readFile(file)), 'string',
    '`read file` should be converted to a typeof string')
  t.strictEqual(typeof to.string(object), 'string',
    '`object` should be converted to a typeof string')
  t.strictEqual(typeof to.string(number), 'string',
    '`number` should be converted to a typeof string')
  t.strictEqual(typeof to.string(boolean), 'string',
    '`boolean` should be converted to a typeof string')
  t.end()
})

test('to.random', (s) => {
  s.test('to.random - array', (t) => {
    for (let i = 0; i < 1000; i++) {
      let random_item = to.random(array)
      if (array.indexOf(random_item) === -1) {
        t.fail(random_item + ' failed in to.random - array')
        t.end()
        return
      }
    }

    t.pass('to.random - array')
    t.end()
  })

  let values = Object.values(object)
  s.test('to.random - object', (t) => {
    for (let i = 0; i < 1000; i++) {
      let random_item = to.random(object)
      if (values.indexOf(random_item) === -1) {
        t.fail(random_item + ' failed in to.random - object')
        t.end()
        return
      }
    }

    t.pass('to.random - object')
    t.end()
  })

  s.test('to.random - number', (t) => {
    for (let i = -1000; i < 1000; i++) {
      let random_item = to.random(i, 1000)
      if (!(random_item >= i && random_item <= 1000)) {
        t.fail(random_item + ' failed in to.random - number')
        t.end()
        return
      }
    }

    t.pass('to.random - number')
    t.end()
  })

  s.end()
})


test('to.normalString', async (t) => {
  let result
  try {
    // this file has some stupid ass characters in it
    // that need to be removed in order to become like the
    // rest of the fucking world. #microsoftBlowsAtStandards
    const crappy_windows_file = await fs.readFile(file)
    result = to.normalString(crappy_windows_file).match(/\r/g)
    t.equal(result, null,
      'should be a normal string')
  } catch (err) {
    t.fail(result, null, 'the file didn\'t load')
    console.log(err.stack)
  }

  t.end()
})


test('to.type', (t) => {
  t.strictEqual(to.type(string), 'string')
  t.strictEqual(to.type(array), 'array')
  t.strictEqual(to.type(object), 'object')
  t.strictEqual(to.type(buffer), 'buffer')
  t.strictEqual(to.type(number), 'number')
  t.strictEqual(to.type(boolean), 'boolean')
  t.end()
})


test('to.keys', (t) => {
  const keys = to.keys(object)
  t.strictEqual(keys[0], 'one', 'should return one')
  t.strictEqual(keys[1], 'two', 'should return two')
  t.strictEqual(keys[2], 'three', 'should return three')
  t.end()
})

test('to.values', (t) => {
  t.deepEquals(to.values(object), [ 1, 2, 3 ])
  t.deepEquals(to.values(object, '!one'), [ 2, 3 ])
  t.deepEquals(to.values(object, 'one', 'two'), [ 1, 2 ])
  t.end()
})

test('to.entries', (s) => {
  s.test('to.entries - array', (t) => {
    for (const [ i, item ] of to.entries(array)) {
      if (
        typeof i !== 'number' ||
        typeof item !== 'string'
      ) {
        t.fail('to.entries - array failed')
        t.end()
        return
      }
    }
    t.pass('to.entries - array')
    t.end()
  })

  s.test('to.entries - object', (t) => {
    for (const [ key, value, i ] of to.entries(object)) {
      if (
        typeof key !== 'string' ||
        typeof value !== 'number' ||
        typeof i !== 'number'
      ) {
        t.fail('to.entries - object failed')
        t.end()
        return
      }
    }

    t.pass('to.entries - object')
    t.end()
  })

  s.end()
})

test('to.objectEntries', (t) => {
  for (const { key, one, two, three } of to.objectEntries({ test: object })) {
    t.strictEqual(key, 'test', 'The key should be `test`')
    t.strictEqual(one, 1, '`one` should equal 1')
    t.strictEqual(two, 2, '`two` should equal 2')
    t.strictEqual(three, 3, '`three` should equal 3')
  }
  t.end()
})


test('to.normalize', (t) => {
  const actual = `
    .foo {
      background: blue;
    }
  `
  const expected = [ '.foo {', '  background: blue;', '}' ].join('\n')

  t.strictEqual(to.normalize(actual), expected, 'all whitespace should be stripped')
  t.ok(actual.split('\n')[2].length > 19, 'should be greater than 19')
  t.strictEqual(to.normalize(actual).split('\n')[1].length, 19, 'should be 19')
  t.end()
})


test('to.indentLevel', (t) => {
  const str = `
    .foo {
      background: blue;
    }
    `
  t.ok(to.indentLevel(str) === 4, 'indent level should be 4')

  t.end()
})

test('to.extend', (t) => {
  const temp = to.extend({}, object)
  t.deepEqual(object, object,
    'should equal each other, because they\'re the same')
  t.deepEqual(temp, object,
    'should be the same as the first object')
  t.strictEqual(to.extend(temp, { one: 3 }).one, 3,
    '`one` should be equal to 3')
  t.end()
})


test('to.clone', (t) => {
  const actual = { one: { two: { three: { four: { five: 'whatup' } } } } }
  const expected = { one: { two: { three: { four: { five: 'whatup' } } } } }
  const test_one = to.clone(actual)
  test_one.test = 'yo'
  t.ok(actual.test === undefined,
    '`acutal.test` should not be defined')
  t.ok(test_one.test === 'yo',
    '`test_one.test` should equal yo')
  t.deepEqual(actual, expected,
    'the actual object should remain the same as the expected object')
  t.end()
})


test('to.merge', (t) => {
  const a = {
    foo: {
      bar: '1',
      baz: [ '3', '4' ],
      qux: 'one',
      quux: { garply: { waldo: 'one' } }, waldo: ''
    }
  }
  const b = {
    foo: {
      bar: '2',
      baz: [ '5', '6' ],
      qux: [ 'two', 'three' ],
      quux: { garply: { waldo: 'two' } },
      waldo() {
        return this
      },
      garply: 'item'
    }
  }
  t.strictEqual(a.foo.bar, '1', 'a.foo.bar should be 1')
  to.merge(a, b)
  t.ok(Array.isArray(a.foo.bar), 'a.foo.bar should be an array')
  t.ok(Array.isArray(a.foo.baz), 'a.foo.baz should be an array')
  t.ok(Array.isArray(a.foo.quux.garply.waldo),
    'a.foo.quux.garply.waldo should be an array')
  t.end()
})

test('to.filter', (t) => {
  t.deepEquals(
    to.filter(array, (obj) => obj !== 'one'),
    [ 'two', 'three' ]
  )
  t.deepEquals(
    to.filter(array, (obj) => obj !== 'two'),
    [ 'one', 'three' ]
  )
  t.deepEquals(
    to.filter(object, ({ key }) => key !== 'one'),
    { two: 2, three: 3 }
  )
  t.deepEquals(
    to.filter(object, ({ value }) => value !== 1),
    { two: 2, three: 3 }
  )
  t.end()
})

test('to.map', (t) => {
  t.deepEquals(
    to.map(array, (item) => item + ' test'),
    [ 'one test', 'two test', 'three test' ]
  )
  t.deepEquals(
    to.map(object, ({ key, value }) => {
      return { [`${key} test`]: value }
    }),
    { 'one test': 1, 'two test': 2, 'three test': 3 }
  )
  t.end()
})

test('to.reduce', (t) => {
  t.deepEquals(
    to.reduce([ object, object, object ], (previous, next) => to.extend(previous, next), {}),
    object
  )

  t.deepEquals(
    to.reduce(object, (previous, { key }) => {
      return [ ...previous, key ]
    }, []),
    array
  )
  t.end()
})


test('to.object', async (t) => {
  try {
    const json = await fs.readFile(path.join(process.cwd(), 'package.json'))
    t.ok(to.object(json).author,
      'the passed json should now be an object')
  } catch (err) {
    t.fail('to.object failed')
    console.log(err.stack)
  }

  t.end()
})

test('to.json', (t) => {
  const obj = { foo: 'foo', bar: 'foo' }
  t.ok(typeof obj === 'object',
    'the test object should be an object')
  t.ok(typeof to.json(obj) === 'string',
    'should be a json string')
  t.end()
})


test('to.array', (t) => {
  t.ok(Array.isArray(array),
    'array should should be an array')
  t.ok(Array.isArray(to.array(array)),
    'array should be be returned with no changes')
  const tests = {
    'string': string,
    'object': object,
    'number': number
  }
  for (let key in tests) {
    if (tests.hasOwnProperty(key)) {
      let value = tests[key]
      t.ok(!Array.isArray(value),
        `${key} should not be an array`)
      t.ok(Array.isArray(to.array(value)),
        `${key} should be converted to a type of array`)
    }
  }

  t.end()
})


test('to.flatten', (t) => {
  t.strictEqual(to.flatten([ [ [ array ] ] ])[0], 'one',
    'the array should be flattend and the first value should be one')

  const obj1 = {
    obj1_one_1: {
      obj1_one_2: {
        obj1_one_3: 'whatup'
      }
    },
    obj1_two_1: 'shoot'
  }
  const obj2 = {
    obj2_one_1: {
      obj2_one_2: {
        obj2_one_3: 'whatup'
      }
    },
    obj2_two_1: 'shoot'
  }
  t.deepEquals(to.flatten(obj1), { 'obj1_one_1.obj1_one_2.obj1_one_3': 'whatup', obj1_two_1: 'shoot' })
  t.deepEquals(to.flatten(obj2), { 'obj2_one_1.obj2_one_2.obj2_one_3': 'whatup', obj2_two_1: 'shoot' })
  t.deepEquals(to.flatten(obj1, obj2), {
    'obj1_one_1.obj1_one_2.obj1_one_3': 'whatup', obj1_two_1: 'shoot',
    'obj2_one_1.obj2_one_2.obj2_one_3': 'whatup', obj2_two_1: 'shoot'
  })
  t.end()
})


test('to.unique', (t) => {
  t.strictEqual(to.unique([ 'one', 'one', 'two', 'two' ]).length, 2,
    'should have a length of 2')
  t.end()
})


test('to.sort', (t) => {
  const acutal_object = {
    c: 1,
    b: 2,
    a: 3
  }
  const actual_array = [ 3, 2, 1 ]

  t.strictEqual(Object.keys(acutal_object)[0], 'c',
    'c should be the first key in the object')
  t.strictEqual(Object.keys(to.sort(acutal_object))[0], 'a',
    'a should be the first key in the object after it\'s sorted')

  t.strictEqual(actual_array[0], 3)
  t.strictEqual(to.sort(actual_array)[0], 1)
  t.end()
})


test('to.number', (t) => {
  t.strictEqual(to.number(4), 4,
    'should be 4')
  t.strictEqual(to.number([ 'a', 'b', 'c' ]), 3,
    'should be 3')
  t.strictEqual(to.number({ a: 1, b: 2, c: 3 }), 3,
    'should be 3')
  t.strictEqual(to.number('foo'), 0,
    'should be 0')
  t.strictEqual(to.number('10'), 10,
    'should be 10')
  t.strictEqual(to.number(false), 0,
    'should be 0')
  t.strictEqual(to.number(true), 1,
    'should be 1')
  t.end()
})


test('to.regex', (t) => {
  t.ok(to.regex('whatup').toString() === /whatup/.toString(),
    'should be  `/whatup/`')
  t.ok(to.regex('whatup', 'gm').toString() === /whatup/gm.toString(),
    'should be  `/whatup/gm`')
  t.end()
})
