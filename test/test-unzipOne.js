const tap = require('tap')
const fs = require('fs')
const unzipOne = require('../unzipOne')

tap.test('unzipOne', async t => {
  t.test('setup', t => {
    try {
      fs.unlinkSync('test/tmp/needle.txt')
    } catch (e) { /* ignore */ }
    t.end()
  })
  t.test('no easteregg in haystack.zip', async t => {
    const ee = await unzipOne('./test/data/haystack.zip', 'easteregg.txt', './test/tmp/')
    t.notOk(ee, 'Did not expect to find easteregg in haystack: ' + ee)
    t.end()
  })
  t.test('get needle.txt in haystack.zip', async t => {
    const ee = await unzipOne('./test/data/haystack.zip', 'needle.txt', './test/tmp/')
    t.ok(ee, 'Did expect to find needle.txt in haystack: ' + ee)
    const truism = fs.readFileSync('./test/tmp/needle.txt', 'utf-8')
    t.ok(truism)
    t.equal(truism.trim(), 'true')
    t.end()
  })
  t.test('cleanup', t => {
    try {
      fs.unlinkSync('test/tmp/needle.txt')
    } catch (e) { /* ignore */ }
    t.end()
  })
  t.end()
})
