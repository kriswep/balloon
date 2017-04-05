/* globals test expect document */
import './app.helper';

test('app helper should add canvas', () => {
  expect(document.querySelector('canvas')).toBeDefined();
});
