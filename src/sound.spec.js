/* globals test expect jest window document Event */

import 'web-audio-mock';
import sound from './sound';


// small localStorage mock
global.localStorage = {
  getItem: jest.fn()
    .mockImplementationOnce(() => null)
    .mockImplementation(() => 1),
};

test('Sound should have a init function which inits audioContext', () => {
  // mock window.webkitAudioContext, window.AudioConext is mocked through import above
  window.webkitAudioContext = window.AudioContext;
  window.AudioContext = undefined;
  expect(sound.aCtx).not.toBeDefined();
  expect(sound.init).toBeDefined();
  expect(sound.init.bind(sound)).not.toThrow();
  expect(sound.aCtx).toBeDefined();
  expect(sound.mainGain).toBeDefined();
  expect(sound.mainGain.gain.value).toBe(0.8);

  // remock window.AudioContext
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

