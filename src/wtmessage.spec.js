
/* globals test expect */
import WtMessage from './wtmessage';

test('WtMessage should have draw and update function', () => {
  const msg = new WtMessage();

  expect(msg.draw).toBeDefined();
  expect(msg.update).toBeDefined();
});
