/* globals test expect jest window document Event */

import sound from './sound';

test('Sound should have a playPlop function', () => {
  expect(sound.playPlop).toBeDefined();
});
