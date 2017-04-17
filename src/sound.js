/* globals window AudioContext */
const sound = {
  aCtx: undefined,
  init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.aCtx = new AudioContext();
  },
  playPlop() {
    if (!this.aCtx) {
      this.init();
    }
    const duration = 0.5;
    const mainGain = this.aCtx.createGain();

    mainGain.gain.setValueAtTime(1, this.aCtx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.1, this.aCtx.currentTime + duration);

    mainGain.connect(this.aCtx.destination);

    const frequencies = [50, 80, 100, 120, 220];
    frequencies.forEach((frequency) => {
      const osc = this.aCtx.createOscillator();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.aCtx.currentTime);
      osc.connect(mainGain);

      osc.start(this.aCtx.currentTime);
      osc.stop(this.aCtx.currentTime + duration);
    });
  },
};

export default sound;
