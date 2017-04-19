/* globals window AudioContext */
const sound = {
  aCtx: undefined,
  init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.aCtx = new AudioContext();
  },
  noiseBuffer() {
    const bufferSize = this.aCtx.sampleRate;
    const buffer = this.aCtx.createBuffer(1, bufferSize, this.aCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = (Math.random() * 0.25) - 0.125;
    }

    return buffer;
  },
  playPlop() {
    if (!this.aCtx) {
      this.init();
    }
    const time = sound.aCtx.currentTime;
    const noise = this.aCtx.createBufferSource();
    const noiseEnvelope = this.aCtx.createGain();

    noise.buffer = this.noiseBuffer();
    noise.connect(noiseEnvelope);
    noiseEnvelope.connect(this.aCtx.destination);

    noiseEnvelope.gain.setValueAtTime(1, time);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    noise.start(time);
    noise.stop(time + 0.2);
  },
};

export default sound;
