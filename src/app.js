/* global window document */
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import WTGM from './wtgm';
import ResourceLoader, { ResourceType } from './resourceLoader';
import './ui';

import './css/ml.css';
import './css/ui.css';

/* eslint-disable no-console */
export const updateHandler = {
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },
  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  },
};
/* eslint-enable no-console */
OfflinePluginRuntime.install(updateHandler);
// OfflinePluginRuntime.install({
//   onUpdating: () => {
//     console.log('SW Event:', 'onUpdating');
//   },
//   onUpdateReady: () => {
//     console.log('SW Event:', 'onUpdateReady');
//     // Tells to new SW to take control immediately
//     OfflinePluginRuntime.applyUpdate();
//   },
//   onUpdated: () => {
//     console.log('SW Event:', 'onUpdated');
//     // Reload the webpage to load into the new version
//     window.location.reload();
//   },
//   onUpdateFailed: () => {
//     console.log('SW Event:', 'onUpdateFailed');
//   },
// });

// import './img/sprite.png';
// import './img/back.png';

export default function preloadResources(canvas, callback) {
  // const c = canvas.getContext('2d');
  function printProgressBar() {
  }

  const rl = new ResourceLoader(printProgressBar, callback);

  rl.addResource('./img/sprite.png', null, ResourceType.IMAGE);
  rl.addResource('./img/back.png', null, ResourceType.IMAGE);

  rl.startPreloading();


  printProgressBar();
}

window.addEventListener('load', WTGM.init.bind(null, preloadResources));
window.addEventListener('resize', WTGM.resize);
window.addEventListener('keydown', WTGM.handleKeyDown);


// window.onblur = function () {
//   // console.log('lostBlur');
// };
// window.focusout = function () {
//   // console.log('lostFocus');
// };


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
document.querySelector('canvas').addEventListener('mousemove', (e) => {
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
// document.querySelector('#moveUp').addEventListener(pointer.DOWN, (e) => {
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
// document.querySelector('#moveDown').addEventListener(pointer.DOWN, (e) => {
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
// document.querySelector('#moveLeft').addEventListener(pointer.DOWN, (e) => {
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
// document.querySelector('#moveRight').addEventListener(pointer.DOWN, (e) => {
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
// document.querySelector('#movement li').addEventListener(pointer.UP, (e) => {
//   if (int != 0) {
//     window.clearInterval(int);
//     if (!movedOnce) {
//       WTGM.move(dir);
//     }
//     int = 0;
//   }
// });
// document.querySelector('#movement').addEventListener(pointer.UP, (e) => {
//   e.preventDefault();
// });

/* Device Motion */
/* TODO: Check ob DeviceOrientation besser geeignet ( http://www.html5rocks.com/en/tutorials/device/orientation/ ) */
