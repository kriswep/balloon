/* globals test expect jest window document Event */

import 'web-audio-mock';
import sound from './sound';

test('Sound should have a init function which inits audioContext', () => {
  // mock window.webkitAudioContext, window.AudioConext is mocked through import above
  // small localStorage mock
  global.localStorage = {
    getItem: jest.fn().mockImplementation(() => null),
    setItem: jest.fn(),
  };
  window.webkitAudioContext = window.AudioContext;
  window.AudioContext = undefined;
  expect(sound.aCtx).not.toBeDefined();
  expect(sound.init).toBeDefined();
  expect(sound.init.bind(sound)).not.toThrow();
  expect(sound.aCtx).toBeDefined();
  expect(sound.mainGain).toBeDefined();
  expect(sound.mainGain.gain.value).toBe(0.8);

  // remock window.AudioContext
  // small localStorage mock
  global.localStorage = {
    getItem: jest.fn().mockImplementation(() => 1),
    setItem: jest.fn(),
  };
  window.AudioContext = window.webkitAudioContext;
  window.webkitAudioContext = undefined;
  sound.aCtx = undefined;
  expect(sound.aCtx).not.toBeDefined();
  expect(sound.init).toBeDefined();
  expect(sound.init.bind(sound)).not.toThrow();
  expect(sound.aCtx).toBeDefined();
  expect(sound.mainGain).toBeDefined();
  expect(sound.mainGain.gain.value).toBe(1);
});

test('Sound should have a playPlop function', () => {
  expect(sound.noiseBuffer).toBeDefined();
  expect(sound.playPlop).toBeDefined();

  sound.aCtx = undefined;
  expect(sound.playPlop.bind(sound)).not.toThrow();
  expect(sound.playPlop.bind(sound)).not.toThrow();
});

test('Sound should maintain volume', () => {
  // small localStorage mock
  global.localStorage = {
    getItem: jest
      .fn()
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 0)
      .mockImplementation(() => 0.5),
    setItem: jest.fn(),
  };
  expect(sound.getVolume).toBeDefined();
  expect(sound.setVolume).toBeDefined();
  expect(sound.getVolume()).toBe(0.8);
  expect(sound.getVolume()).toBe(1);
  expect(sound.getVolume()).toBe(0);
  expect(sound.getVolume()).toBe(0.5);

  expect(sound.setVolume.bind(sound, [0.3])).not.toThrow();
  expect(global.localStorage.setItem.mock.calls[0]).toEqual(['sound', [0.3]]);
});
