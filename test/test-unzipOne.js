const tap = require('tap');
const unzipOne = require('../unzipOne');

tap.test('unzipOne', async t => {
    t.test('no easteregg in haystack.zip', async t => {
        const ee = await unzipOne('./test/data/haystack.zip', 'easteregg.txt', './test/tmp/');
        t.notOk(ee, 'Did not expect to find easteregg in haystack: ' + ee);
        t.done();
    });
    t.test('get needle.txt in haystack.zip', async t => {
        const ee = await unzipOne('./test/data/haystack.zip', 'needle.txt', './test/tmp/');
        t.ok(ee, 'Did expect to find needle.txt in haystack: ' + ee);
        t.done();
    });
    t.end();
});