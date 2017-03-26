/* globals window */
// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback

const requestAnimFrame = (function shimmedRequestAnimFrame() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function timeoutAnimation(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());

export default requestAnimFrame;
