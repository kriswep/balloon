/* globals test expect jest document */
import WTGM from './wtgm';

// small localStorage mock
global.localStorage = {
  getItem: jest.fn(() => 0),
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
  jest.useFakeTimers();
  const cvs = document.createElement('canvas');
  document.body.appendChild(cvs);
  function preloadResources(canvas, callback) {
    callback();
  }
  expect(WTGM.init.bind(null, preloadResources)).not.toThrow();
  expect(WTGM.startGame).not.toThrow();

  jest.runTimersToTime(10);
  jest.useRealTimers();
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
    isInside: jest.fn(() => true),
    score: 101,
  });
  WTGM.objects.push({
    isInside: jest.fn(() => true),
    score: 200,
  });
  WTGM.objects.push({
    isInside: jest.fn(() => false),
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
  WTGM.highscoreBroken = 0;
  WTGM.touching = 1;
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.score).toBe(2);

  // end missed touch, should lose some points...
  WTGM.touching = 1;
  WTGM.highscoreBroken = 1;
  WTGM.highsore = 1000;
  WTGM.score = 1001;
  expect(WTGM.handleTouchEnd.bind(WTGM)).not.toThrow();
  expect(WTGM.highscoreBroken).toBeFalsy();
});

// endGame
test('WTGM endGame schould update ui', () => {
  WTGM.paused = 0;
  // fake ui
  const startGame = document.createElement('div');
  const inGameOption = document.createElement('div');
  const ui = document.createElement('div');
  const openMenu = document.createElement('div');
  startGame.classList.add('startGame');
  inGameOption.classList.add('inGameOption');
  ui.classList.add('ui', 'gameRunning');
  openMenu.classList.add('openMenu');
  document.body.appendChild(startGame);
  document.body.appendChild(inGameOption);
  document.body.appendChild(ui);
  document.body.appendChild(openMenu);

  // call
  expect(WTGM.endGame.bind(WTGM)).not.toThrow();

  // assert
  expect(WTGM.paused).toBeTruthy();
  expect(document.querySelector('.startGame').textContent)
    .toBe('Play');
  expect(document.querySelector('.inGameOption').style.display)
    .toBe('none');
  expect(document.querySelector('.ui').classList.contains('gameRunning'))
    .toBe(false);
  expect(document.querySelector('.ui').style.display)
    .toBe('');
  expect(document.querySelector('.openMenu').style.display)
    .toBe('none');
});

// setScore
test('WTGM should set score', () => {
  global.localStorage.getItem.mockClear();
  global.localStorage.setItem.mockClear();
  WTGM.score = 100;
  // call
  expect(WTGM.setScore.bind(WTGM)).not.toThrow();
  // should have read and set localStorage 10 times
  expect(global.localStorage.getItem.mock.calls.length)
    .toBe(10);
  expect(global.localStorage.setItem.mock.calls.length)
    .toBe(10);
  expect(global.localStorage.setItem.mock.calls[0])
    .toEqual([1, 100 / 100]); // thats our highscore
});

// update
test('WTGM should update its objects', () => {
  WTGM.objects = [];
  // update should end Game
  WTGM.paused = 0;
  WTGM.life = 0;
  expect(WTGM.update.bind(WTGM)).not.toThrow();
  expect(WTGM.paused).toBeTruthy();

  // add mocked objects
  WTGM.objects = [];
  WTGM.objects.push({
    update: jest.fn(),
    remove: false,
  });
  WTGM.objects.push({
    update: jest.fn(),
    remove: true,
  });
  WTGM.life = 1;
  expect(WTGM.update.bind(WTGM)).not.toThrow();

  // should have called objects update
  expect(WTGM.objects[0].update.mock.calls.length).toBe(1);
  // should have removed objects to remove
  expect(WTGM.objects.length).toBe(1);
});

// render
test('WTGM should render to canvas', () => {
  // mock ctx
  WTGM.ctx = jest.fn();
  WTGM.ctx.clearRect = jest.fn();
  WTGM.ctx.fillRect = jest.fn();
  WTGM.ctx.drawImage = jest.fn();
  WTGM.ctx.fillText = jest.fn();
  // add mocked objects
  WTGM.objects = [];
  WTGM.objects.push({
    draw: jest.fn(),
  });
  expect(WTGM.render.bind(WTGM)).not.toThrow();

  expect(WTGM.ctx.clearRect.mock.calls[0])
    .toEqual([0, 0, WTGM.WIDTH, WTGM.HEIGHT]);
  expect(WTGM.ctx.fillRect.mock.calls[0])
    .toEqual([0, 0, WTGM.WIDTH, WTGM.HEIGHT]);
  expect(WTGM.ctx.drawImage.mock.calls.length)
    .toBeGreaterThan(0);
  expect(WTGM.ctx.fillText.mock.calls.length)
    .toBeGreaterThan(0);

  expect(WTGM.objects[0].draw.mock.calls.length).toBe(1);

  WTGM.ctx.clearRect.mockClear();
  WTGM.ctx.fillRect.mockClear();
  WTGM.ctx.drawImage.mockClear();
  WTGM.ctx.fillText.mockClear();

  // draw fps should not throw
  WTGM.showFps = 1;
  expect(WTGM.render.bind(WTGM)).not.toThrow();

  WTGM.ctx.clearRect.mockClear();
  WTGM.ctx.fillRect.mockClear();
  WTGM.ctx.drawImage.mockClear();
  WTGM.ctx.fillText.mockClear();
});

// loop
test('WTGM should have a loop function', () => {
  WTGM.objects = [];
  WTGM.paused = 0;
  WTGM.showFps = 1;
  // loop should call update and render,
  // which we already tested
  expect(WTGM.loop.bind(WTGM)).not.toThrow();

  // we just test fps,
  // which is quite high with this mock data
  WTGM.lastFrame = new Date().getTime() - 1;
  expect(WTGM.loop.bind(WTGM)).not.toThrow();
  expect(WTGM.fps).toBeGreaterThan(60);
});

// should generate balloons
test('WTGM should generate balloons', () => {
  WTGM.createObjectTime = new Date().getTime();
  WTGM.objects = [];
  expect(WTGM.generateBalloon.bind(WTGM)).not.toThrow();
  expect(WTGM.objects.length).toBe(1);
  expect(WTGM.objects[0].balloonNumber).toBeDefined();

  // should not add right away
  expect(WTGM.generateBalloon.bind(WTGM)).not.toThrow();
  expect(WTGM.objects.length).toBe(1);

  // should add  in baby mode
  WTGM.baby = 1;
  WTGM.createObjectTime = new Date().getTime();
  WTGM.objects = [];
  expect(WTGM.generateBalloon.bind(WTGM)).not.toThrow();
  expect(WTGM.objects.length).toBe(1);
  expect(WTGM.objects[0].balloonNumber).toBeDefined();
});

// decrease life
test('WTGM should have a helper to decrease life', () => {
  WTGM.life = 10;
  WTGM.decreaseLife();
  expect(WTGM.life).toBe(9);
  WTGM.decreaseLife(0);
  expect(WTGM.life).toBe(9);
  WTGM.decreaseLife(9);
  expect(WTGM.life).toBe(0);
});

// baby mode
test('WTGM should have baby mode', () => {
  WTGM.baby = 0;
  WTGM.paused = 0;
  // baby mode should be toggable
  expect(WTGM.toggleBaby).not.toThrow();
  expect(WTGM.baby).toBeTruthy();
  expect(WTGM.mode).toBe(50);
  expect(WTGM.paused).toBeTruthy();

  WTGM.paused = 0;
  expect(WTGM.toggleBaby).not.toThrow();
  expect(WTGM.baby).toBeFalsy();
  expect(WTGM.mode).toBe(3);
  expect(WTGM.paused).toBeTruthy();

  expect(WTGM.toggleBaby).not.toThrow();
  expect(WTGM.baby).toBeTruthy();
  expect(WTGM.mode).toBe(50);
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
