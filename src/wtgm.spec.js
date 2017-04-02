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

// pixels should be translated to canvas
test('WTGM should be able to translate Pixels', () => {
  expect(WTGM.translatePixels(10, 20))
    .toEqual({ x: 6.25, y: 12.5 });
  expect(WTGM.translatePixels(50, 60))
    .toEqual({ x: 31.25, y: 37.5 });
});

// touch handling
test('WTGM should handle touch', () => {
  expect(WTGM.handleTouch.bind(WTGM, 10, 20)).not.toThrow();

  // convice WTGM it is touched, but end touch directly
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.touching).toBeFalsy();

  // add mocked objects
  WTGM.objects.push({
    isInside: jest.fn().mockReturnValue(true),
    score: 101,
  });
  WTGM.objects.push({
    isInside: jest.fn().mockReturnValue(true),
    score: 200,
  });
  WTGM.objects.push({
    isInside: jest.fn().mockReturnValue(false),
    score: 300,
  });
  // convice WTGM it is touched, and touch
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  expect(WTGM.handleTouch.bind(WTGM, 10, 20)).not.toThrow();
  expect(WTGM.hit).toBe(2);
  // end current touches
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.score).toBe(101 + (200 * 2));
  expect(WTGM.objects
    .filter(obj => obj.remove).length,
  ).toBe(2);

  // break highscore
  WTGM.highsore = 1;
  // convice WTGM it is touched, and touch
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  expect(WTGM.handleTouch.bind(WTGM, 10, 20)).not.toThrow();
  // end current touches
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.highscoreBroken).toBeTruthy();


  // end missed touch, only if touch is running...
  WTGM.touching = 0;
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.score).toBe(1002);

  // end missed touch, should lose some points...
  WTGM.touching = 1;
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.score).toBe(2);
});

// should generate balloons
test('WTGM should generate balloons', () => {
  WTGM.objects = [];
  expect(WTGM.generateBalloon.bind(WTGM)).not.toThrow();
  expect(WTGM.objects.length).toBe(1);
  expect(WTGM.objects[0].balloonNumber).toBeDefined();

  // should not add right away
  expect(WTGM.generateBalloon.bind(WTGM)).not.toThrow();
  expect(WTGM.objects.length).toBe(1);
});

// draw helpers
test('WTGM should provide draw helpers', () => {
  expect(WTGM.Draw).toBeDefined();
  expect(WTGM.Draw.clear).toBeDefined();
  expect(WTGM.Draw.rect).toBeDefined();
  expect(WTGM.Draw.circle).toBeDefined();
  expect(WTGM.Draw.text).toBeDefined();

  WTGM.ctx = jest.fn();

  // test clear helper
  WTGM.ctx.clearRect = jest.fn();
  WTGM.Draw.clear();
  expect(WTGM.ctx.clearRect.mock.calls[0])
    .toEqual([0, 0, WTGM.WIDTH, WTGM.HEIGHT]);
  WTGM.ctx.clearRect.mockClear();

  // test rect helper
  WTGM.ctx.fillRect = jest.fn();
  WTGM.Draw.rect(10, 20, 30, 40, 'purple');
  expect(WTGM.ctx.fillStyle)
    .toEqual('purple');
  expect(WTGM.ctx.fillRect.mock.calls[0])
    .toEqual([10, 20, 30, 40]);
  WTGM.ctx.fillRect.mockClear();

  // test circle helper
  WTGM.ctx.beginPath = jest.fn();
  WTGM.ctx.arc = jest.fn();
  WTGM.ctx.closePath = jest.fn();
  WTGM.ctx.fill = jest.fn();
  WTGM.Draw.circle(10, 20, 30, 'pink');
  expect(WTGM.ctx.fillStyle)
    .toEqual('pink');
  expect(WTGM.ctx.beginPath.mock.calls.length)
    .toBe(1);
  expect(WTGM.ctx.arc.mock.calls[0])
    .toEqual([15, 25, 30, 0, 6.283185307179586, true]);
  expect(WTGM.ctx.closePath.mock.calls.length)
    .toBe(1);
  expect(WTGM.ctx.fill.mock.calls.length)
    .toBe(1);
  WTGM.ctx.beginPath.mockClear();
  WTGM.ctx.arc.mockClear();
  WTGM.ctx.closePath.mockClear();
  WTGM.ctx.fill.mockClear();

  // test text helper
  WTGM.ctx.fillText = jest.fn();
  WTGM.Draw.text('foo', 10, 20, 30, 'yellow');
  expect(WTGM.ctx.font)
    .toEqual('bold 30px Monospace');
  expect(WTGM.ctx.fillStyle)
    .toEqual('yellow');
  expect(WTGM.ctx.fillText.mock.calls[0])
    .toEqual(['foo', 10, 20]);
  WTGM.ctx.fillText.mockClear();
});
