/* globals test expect jest document Event */
import { ready, addListenerMulti, initUI } from './ui';
import WTGM from './wtgm';
import sound from './sound';

jest.mock('./wtgm', () =>
  ({
    setScore: jest.fn(),
    startGame: jest.fn(),
    toggleBaby: jest.fn(),
  }),
);

jest.mock('./sound', () =>
  ({
    setVolume: jest.fn(),
    getVolume: jest.fn()
      .mockImplementation(() => 0.3),
  }),
);

test('UI should have addListenerMulti helper', () => {
  const elem = {
    addEventListener: jest.fn(),
  };
  expect(addListenerMulti).toBeDefined();
  addListenerMulti(elem, 'evt1 evt2', 'cb');

  expect(elem.addEventListener.mock.calls[0])
    .toEqual(['evt1', 'cb', false]);
  expect(elem.addEventListener.mock.calls[1])
    .toEqual(['evt2', 'cb', false]);
});


test('UI should have ready helper', () => {
  expect(ready).toBeDefined();
  const fn = jest.fn();
  let state = 'complete';
  Object.defineProperty(document, 'readyState', {
    get() {
      return state;
    },
  });

  ready(fn);
  expect(fn).toBeCalled();
  fn.mockClear();

  state = 'loading';

  ready(fn);
  expect(fn).not.toBeCalled();
  const event = new Event('DOMContentLoaded');
  document.dispatchEvent(event);
  expect(fn).toBeCalled();

  fn.mockClear();
});

test('UI should init its UI', () => {
  expect(initUI).toBeDefined();

  // mock ui
  const startGame = document.createElement('div');
  const ui = document.createElement('div');
  const canvas = document.createElement('canvas');
  const openMenu = document.createElement('div');
  const toBaby = document.createElement('div');
  const toKids = document.createElement('div');
  const inGameOption = document.createElement('div');
  const resumeGame = document.createElement('div');
  const soundVolume = document.createElement('input');
  startGame.classList.add('startGame');
  ui.classList.add('ui', 'gameRunning');
  openMenu.classList.add('openMenu');
  toBaby.classList.add('toBaby');
  toKids.classList.add('toKids');
  inGameOption.classList.add('inGameOption');
  resumeGame.classList.add('resumeGame');
  soundVolume.classList.add('soundVolume');
  soundVolume.type = 'range';
  soundVolume.value = 0.9;
  document.body.appendChild(startGame);
  document.body.appendChild(ui);
  document.body.appendChild(canvas);
  document.body.appendChild(openMenu);
  document.body.appendChild(toBaby);
  document.body.appendChild(toKids);
  document.body.appendChild(inGameOption);
  document.body.appendChild(resumeGame);
  document.body.appendChild(soundVolume);


  expect(initUI).not.toThrow();

  const event = new Event('touchstart');
  startGame.dispatchEvent(event);
  expect(WTGM.setScore).toBeCalled();
  expect(WTGM.startGame).toBeCalled();
  WTGM.setScore.mockClear();
  WTGM.startGame.mockClear();

  event.preventDefault = jest.fn();
  toBaby.dispatchEvent(event);
  expect(event.preventDefault).toBeCalled();
  expect(WTGM.toggleBaby).toBeCalled();
  expect(document.querySelector('.toBaby').style.display)
    .toBe('none');
  expect(document.querySelector('.toKids').style.display)
    .toBe('');
  event.preventDefault.mockClear();
  WTGM.toggleBaby.mockClear();

  toKids.dispatchEvent(event);
  expect(event.preventDefault).toBeCalled();
  expect(WTGM.toggleBaby).toBeCalled();
  expect(document.querySelector('.toBaby').style.display)
    .toBe('');
  expect(document.querySelector('.toKids').style.display)
    .toBe('none');
  event.preventDefault.mockClear();
  WTGM.toggleBaby.mockClear();

  WTGM.paused = 0;
  WTGM.hit = 0;
  openMenu.dispatchEvent(event);
  expect(WTGM.paused).toBeTruthy();
  expect(WTGM.hit).toBeTruthy();
  WTGM.hit = 1;
  openMenu.dispatchEvent(event);
  expect(WTGM.hit).toBeTruthy();


  WTGM.paused = 1;
  WTGM.hit = 0;
  resumeGame.dispatchEvent(event);
  expect(WTGM.paused).toBeFalsy();
  expect(WTGM.hit).toBeTruthy();
  WTGM.hit = 1;
  resumeGame.dispatchEvent(event);
  expect(WTGM.hit).toBeTruthy();


  expect(soundVolume.value).toBe('0.3');
  const changeEvent = new Event('change');
  soundVolume.dispatchEvent(changeEvent);
  expect(sound.setVolume).toBeCalled();
  expect(sound.setVolume.mock.calls[0]).toEqual(['0.3']);
  sound.setVolume.mockClear();
  WTGM.startGame.mockClear();
});
