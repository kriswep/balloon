/* globals window AudioContext */
const sound = {
  aCtx: undefined,
  init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.aCtx = new AudioContext();
  },
  playPlop() {

  },
};

export default sound;
