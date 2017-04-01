/* globals test expect jest document */
import WTGM from './wtgm';

// small localStorage mock
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

test('WTGM should have it\'s necessary functions', () => {
  expect(WTGM.init).toBeDefined();
  expect(WTGM.resize).toBeDefined();
  expect(WTGM.startGame).toBeDefined();
  expect(WTGM.endGame).toBeDefined();
  expect(WTGM.update).toBeDefined();
  expect(WTGM.render).toBeDefined();
  expect(WTGM.loop).toBeDefined();
  expect(WTGM.Draw).toBeDefined();
});

// smoke test
test('WTGM should be initialisable', () => {
  const cvs = document.createElement('canvas');
  document.body.appendChild(cvs);
  function preloadResources(canvas, callback) {
    callback();
  }
  expect(WTGM.init.bind(null, preloadResources)).not.toThrow();
  expect(WTGM.startGame).not.toThrow();
  // TODO: needs improvement, mocking of DOM elements
  // expect(WTGM.loop).not.toThrow();
  // expect(WTGM.endGame).not.toThrow();
});
