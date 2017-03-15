/* globals window */
// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
// const requestAnimationFrameFallback = (callback) => {
//   window.setTimeout(callback, 1000 / 60);
// };

// export default () => window.requestAnimationFrame ||
//   window.webkitRequestAnimationFrame ||
//   window.mozRequestAnimationFrame ||
//   window.oRequestAnimationFrame ||
//   window.msRequestAnimationFrame ||
//   requestAnimationFrameFallback;

const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());

export default requestAnimFrame;
