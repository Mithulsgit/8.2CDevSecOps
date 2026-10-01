const t = require('tap');
const utils = require('../utils');

t.test('ran_no returns a number within the requested range', t => {
  for (let i = 0; i < 100; i++) {
    const result = utils.ran_no(1, 10);
    t.ok(result >= 1 && result <= 10, 'result is within range');
  }
  t.end();
});

t.test('uid returns an alphanumeric string of the requested length', t => {
  const result = utils.uid(16);

  t.equal(result.length, 16, 'UID has correct length');
  t.match(result, /^[A-Za-z0-9]+$/, 'UID contains only alphanumeric characters');
  t.end();
});

t.test('uid returns different values across calls', t => {
  const first = utils.uid(16);
  const second = utils.uid(16);

  t.not(first, second, 'two generated UIDs are different');
  t.end();
});
