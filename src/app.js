/* global window */
import $ from 'jquery/dist/jquery.min';
import WTGM from './wtgm';
import ResourceLoader, { ResourceType } from './resourceLoader';
import './ui';

import './css/ml.css';
import './css/ui.css';

// import './img/sprite.png';
// import './img/back.png';

function preloadResources(canvas, callback) {
  // const c = canvas.getContext('2d');

  function printProgressBar() {
  }

  const rl = new ResourceLoader(printProgressBar, callback);

  rl.addResource('./img/sprite.png', null, ResourceType.IMAGE);
  rl.addResource('./img/back.png', null, ResourceType.IMAGE);

  rl.startPreloading();


  printProgressBar();
}

$(window).on('load', WTGM.init.bind(null, preloadResources));
$(window).on('resize', WTGM.resize);
$(window).on('keydown', WTGM.handleKeyDown);


window.onblur = function () {
  // console.log('lostBlur');
};
window.focusout = function () {
  // console.log('lostFocus');
};


function touchEndHandler() {
  WTGM.handleTouchEnd();
}

function touchHandler(event) {
  WTGM.handleTouch(event.pageX, event.pageY);
}

window.addEventListener('mousedown', (e) => {
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  touchHandler(e);
});
$('canvas').on('mousemove', (e) => {
  touchHandler(e);
});
window.addEventListener('mouseup', (e) => {
  touchEndHandler(e);
});

window.addEventListener('touchstart', (e) => {
  e.preventDefault();
  WTGM.touching = 1;
  WTGM.touchStart = new Date().getTime();
  touchHandler(e.touches[0]);
}, false);
window.addEventListener('touchmove', (e) => {
  e.preventDefault();
  touchHandler(e.touches[0]);
  // touchHandler(e.touches[0]);
  // WTGM.handleMouseDown(e.touches[0].pageX, e.touches[0].pageY);
}, false);

window.addEventListener('touchend', (e) => {
  // Verhindert Scrollen/Unnötiges Bewegen nach oben oder unten
  e.preventDefault();
  touchEndHandler();
}, false);


// const pointer = {
//   DOWN: 'mousedown',
//   UP: 'mouseup',
//   MOVE: 'mousemove',
// };
// let int = 0;
// let movedOnce = 0;
// let dir;
// $('#moveUp').on(pointer.DOWN, (e) => {
//   // e.preventDefault();
//   if (int == 0) {
//     dir = 0;
//     movedOnce = 0;
//     int = self.setInterval(() => {
//       movedOnce = 1;
//       WTGM.move(dir);
//     }, 100);
//   }
// });
// $('#moveDown').on(pointer.DOWN, (e) => {
//   // e.preventDefault();
//   if (int == 0) {
//     dir = 1;
//     movedOnce = 0;
//     int = self.setInterval(() => {
//       movedOnce = 1;
//       WTGM.move(dir);
//     }, 100);
//   }
// });
// $('#moveLeft').on(pointer.DOWN, (e) => {
//   // e.preventDefault();
//   if (int == 0) {
//     dir = 2;
//     movedOnce = 0;
//     int = self.setInterval(() => {
//       movedOnce = 1;
//       WTGM.move(dir);
//     }, 100);
//   }
// });
// $('#moveRight').on(pointer.DOWN, (e) => {
//   // e.preventDefault();
//   if (int == 0) {
//     dir = 3;
//     movedOnce = 0;
//     int = self.setInterval(() => {
//       movedOnce = 1;
//       WTGM.move(dir);
//     }, 100);
//   }
// });
// $('#movement li').on(pointer.UP, (e) => {
//   if (int != 0) {
//     window.clearInterval(int);
//     if (!movedOnce) {
//       WTGM.move(dir);
//     }
//     int = 0;
//   }
// });
// $('#movement').on(pointer.UP, (e) => {
//   e.preventDefault();
// });

/* Device Motion */
/* TODO: Check ob DeviceOrientation besser geeignet ( http://www.html5rocks.com/en/tutorials/device/orientation/ ) */
