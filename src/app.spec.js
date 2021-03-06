/* globals test expect jest window document Event */
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import './__helpers__/app.helper';
import preloadResources, { updateHandler } from './app';
import WTGM from './wtgm';
// import ResourceLoader from './resourceLoader';
import './ui';

jest.mock('./wtgm', () =>
  ({
    setScore: jest.fn(),
    startGame: jest.fn(),
    toggleBaby: jest.fn(),
  }),
);

jest.mock('./ui', () =>
  true,
);

jest.mock('./wtgm', () =>
  ({
    init: jest.fn(),
    handleTouch: jest.fn(),
    handleTouchEnd: jest.fn(),

  }),
);
jest.mock('offline-plugin/runtime', () =>
  ({
    install: jest.fn(),
    applyUpdate: jest.fn(),
  }),
);

test('app should kickoff resource preloading', (done) => {
  // dispatch action which sould trigger WTGM.init
  const event = new Event('load');
  window.dispatchEvent(event);
  expect(WTGM.init).toBeCalled();

  expect(preloadResources.bind(null, 'canvas', () => {
    // This should get called
    expect(true).toBeTruthy();
    done();
  })).not.toThrow();
});

test('app should be update offline cache', () => {
  window.location.reload = jest.fn();
  expect(updateHandler).toBeDefined();
  expect(OfflinePluginRuntime.install).toHaveBeenCalled();

  expect(updateHandler.onUpdating).not.toThrow();
  expect(updateHandler.onUpdateReady).not.toThrow();
  expect(OfflinePluginRuntime.applyUpdate).toHaveBeenCalled();
  expect(updateHandler.onUpdated).not.toThrow();
  expect(window.location.reload).toHaveBeenCalled();
  expect(updateHandler.onUpdateFailed).not.toThrow();
});

test('app should add event listeners', () => {
  WTGM.touching = 0;
  const mousedownEvent = new Event('mousedown');
  window.dispatchEvent(mousedownEvent);
  expect(WTGM.handleTouch).toBeCalled();
  expect(WTGM.touching).toBeTruthy();
  WTGM.handleTouch.mockClear();

  const mousemoveEvent = new Event('mousemove');
  document.querySelector('canvas').dispatchEvent(mousemoveEvent);
  expect(WTGM.handleTouch).toBeCalled();
  WTGM.handleTouch.mockClear();

  const mouseupEvent = new Event('mouseup');
  window.dispatchEvent(mouseupEvent);
  expect(WTGM.handleTouchEnd).toBeCalled();
  WTGM.handleTouchEnd.mockClear();

  WTGM.touching = 0;
  const touchstartEvent = new Event('touchstart');
  Object.defineProperty(touchstartEvent, 'touches', {
    get() {
      return [{ clientX: 3 }, { clientY: 2 }];
    },
  });
  window.dispatchEvent(touchstartEvent);
  expect(WTGM.handleTouch).toBeCalled();
  expect(WTGM.touching).toBeTruthy();
  WTGM.handleTouch.mockClear();

  const touchmoveEvent = new Event('touchmove');
  Object.defineProperty(touchmoveEvent, 'touches', {
    get() {
      return [{ clientX: 3 }, { clientY: 2 }];
    },
  });
  window.dispatchEvent(touchmoveEvent);
  expect(WTGM.handleTouch).toBeCalled();
  WTGM.handleTouch.mockClear();

  const touchendEvent = new Event('touchend');
  window.dispatchEvent(touchendEvent);
  expect(WTGM.handleTouchEnd).toBeCalled();
  WTGM.handleTouchEnd.mockClear();
});
