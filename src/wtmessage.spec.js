
/* globals test expect jest */
import WtMessage from './wtmessage';

const getUpdatedProp = (obj, prop) => {
  obj.update();
  return obj[prop];
};

test('WtMessage should have draw, update and isInside function', () => {
  const msg = new WtMessage();

  expect(msg.draw).toBeDefined();
  expect(msg.update).toBeDefined();
  expect(msg.isInside).toBeDefined();
});

test('WtMessage draw should draw message at specified position', () => {
  const WTGM = {
    Draw: {
      text: jest.fn(),
    },
  };
  const expected = ['message', 'x', 'y', 24, 'color'];

  const msg = new WtMessage('message', 'x', 'y', 'color', WTGM);
  msg.draw();

  expect(WTGM.Draw.text.mock.calls.length).toBe(1);
  expect(WTGM.Draw.text.mock.calls[0]).toEqual(expected);
});

test('WtMessage should set its remove prop', () => {
  const msg = new WtMessage();
  // Should not have remove prop directly
  expect(
    getUpdatedProp(msg, 'remove'),
  ).toBeFalsy();

  // Should set its remove prop after some time
  // lets just fake the time
  global.Date = jest.fn();
  global.Date.mockImplementation(() => ({
    getTime: () => msg.insertTime + 701,
  }));
  expect(
    getUpdatedProp(msg, 'remove'),
  ).toBeTruthy();
});

test('WtMessage isInside should return false', () => {
  const msg = new WtMessage();
  expect(msg.isInside()).toBeFalsy();
});
