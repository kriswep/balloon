/* global window */
import $ from '../res/js/jquery';
import WTGM from './wtgm';
import ResourceLoader, { ResourceType } from './resourceLoader';
import './ui';

import '../res/css/ml.css';
import '../res/css/ui.css';

// import './img/sprite.png';
// import './img/back.png';

// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());


function preloadResources(canvas, callback) {
  const c = canvas.getContext('2d');

  const rl = new ResourceLoader(printProgressBar, callback);

  rl.addResource('./img/sprite.png', null, ResourceType.IMAGE);
  rl.addResource('./img/back.png', null, ResourceType.IMAGE);

  rl.startPreloading();

  printProgressBar();

  function printProgressBar() {
    // const percent = Math.floor((rl.resourcesLoaded * 100) / rl.resources.length);
		/*
		var cwidth = Math.floor((percent * (canvas.width - 1)) / 100);

		c.fillStyle = '#000000';
		c.fillRect(0, canvas.height - 30, canvas.width, canvas.height);

		c.fillStyle = '#FFFFFF';
		c.fillRect(1, canvas.height - 28, cwidth, canvas.height - 6);
		*/
  }
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


const pointer = {
  DOWN: 'mousedown',
  UP: 'mouseup',
  MOVE: 'mousemove',
};
/*
if (Modernizr.touch){
		pointer.DOWN = 'touchstart';
		pointer.UP = 'touchend';
		pointer.MOVE = 'touchmove';
}
*/
// window.addEventListener(pointer.UP, function(e) { g.handleMouseUp(e); }, false);
// $("canvas").on('mousedown', function(e){
// touchHandler(e);
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
  //	Verhindert Scrollen/Unnötiges Bewegen nach oben oder unten
  e.preventDefault();
  touchEndHandler();
}, false);


let int = 0;
let movedOnce = 0;
let dir;
$('#moveUp').on(pointer.DOWN, (e) => {
  // e.preventDefault();
  if (int == 0) {
    dir = 0;
    movedOnce = 0;
    int = self.setInterval(() => {
      movedOnce = 1;
      WTGM.move(dir);
    }, 100);
  }
});
$('#moveDown').on(pointer.DOWN, (e) => {
  // e.preventDefault();
  if (int == 0) {
    dir = 1;
    movedOnce = 0;
    int = self.setInterval(() => {
      movedOnce = 1;
      WTGM.move(dir);
    }, 100);
  }
});
$('#moveLeft').on(pointer.DOWN, (e) => {
  // e.preventDefault();
  if (int == 0) {
    dir = 2;
    movedOnce = 0;
    int = self.setInterval(() => {
      movedOnce = 1;
      WTGM.move(dir);
    }, 100);
  }
});
$('#moveRight').on(pointer.DOWN, (e) => {
  // e.preventDefault();
  if (int == 0) {
    dir = 3;
    movedOnce = 0;
    int = self.setInterval(() => {
      movedOnce = 1;
      WTGM.move(dir);
    }, 100);
  }
});
$('#movement li').on(pointer.UP, (e) => {
  if (int != 0) {
    window.clearInterval(int);
    if (!movedOnce) {
      WTGM.move(dir);
    }
    int = 0;
  }
});
$('#movement').on(pointer.UP, (e) => {
  e.preventDefault();
});

/* Device Motion */
let motionMove = 1;
let lastVMove = 0; // Vertical Move
let lastHMove = 0; // Horizontal Move
/* TODO: Check ob DeviceOrientation besser geeignet ( http://www.html5rocks.com/en/tutorials/device/orientation/ )
if (window.DeviceOrientationEvent) {
  // Listen for the deviceorientation event and handle DeviceOrientationEvent object
  window.addEventListener('deviceorientation', function(eventData) {
    eventData.preventDefault();
  }, false);
} else if (window.OrientationEvent) {
  // Listen for the MozOrientation event and handle OrientationData object
  window.addEventListener('MozOrientation', function(eventData) {
    eventData.preventDefault();
  }, false);
}
*/
/*
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', deviceMotionHandler, false);
}

function deviceMotionHandler(eventData) {

    //eventData.preventDefault();
  if (!motionMove){
  	return;
  }
  // Grab the acceleration including gravity from the results
  var acceleration = eventData.accelerationIncludingGravity;

  // Calculate the raw acceleration data
  var rawAcceleration = "[" +  Math.round(acceleration.x) + ", " +
    Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]";

  // Z is the acceleration in the Z axis, and if the device is facing up or down
  var facingUp = -1;
  if (acceleration.z > 0) {
    facingUp = +1;
  }

  // Convert the value from acceleration to degrees acceleration.x|y is the
  // acceleration according to gravity, we'll assume we're on Earth and divide
  // by 9.81 (earth gravity) to get a percentage value, and then multiply that
  // by 90 to convert to degrees.
  var tiltLR = Math.round(((acceleration.x) / 9.81) * -90);
  var tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp);

  // Display the acceleration and calculated values

    if(tiltLR>40){
        move = new Date().getTime();
        if (move-lastHMove >250){
            lastHMove=move;
		    dir=2;
            WTGM.move(dir);
        }
    }
    if(tiltLR<-40){
        move = new Date().getTime();
        if (move-lastHMove >250){
            lastHMove=move;
		    dir=3;
            WTGM.move(dir);
        }
    }
    if(tiltFB<-50){
        move = new Date().getTime();
        if (move-lastVMove >250){
            lastVMove=move;
		    dir=0;
            WTGM.move(dir);
        }
    }
    if(tiltFB>'-10'){
        move = new Date().getTime();
        if (move-lastVMove >250){
            lastVMove=move;
		    dir=1;
            WTGM.move(dir);
        }
    }

  // Apply the 2D rotation and 3D rotation to the image
  //var rotation = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB) + "deg)";
  //document.getElementById("imgLogo").style.webkitTransform = rotation;
}
*/


/* Touch Motion
var lastTouchMove=0; //Touch Move
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', deviceMotionHandler, false);
}

function touchHandler(eventData) {
	var pos = WTGM.translatePixelsToMatrix(eventData.pageX, eventData.pageY);
  	var mpos = WTGM.getMowleePos();
  	if (!pos||!mpos){
  		return;
  	}

    if(pos.row<mpos.row){//Up
        move = new Date().getTime();
        if (move-lastTouchMove >250){
            lastTouchMove=move;
            //disable temp. MotionMove
            lastVMove=move;
            lastHMove=move;
		    dir=0;
            WTGM.move(dir);
        }
    } else
    if(pos.row>mpos.row){//Down
        move = new Date().getTime();
        if (move-lastTouchMove >250){
            lastTouchMove=move;
            //disable temp. MotionMove
            lastVMove=move;
            lastHMove=move;
		    dir=1;
            WTGM.move(dir);
        }
    } else
    if(pos.col<mpos.col){ //Left
        move = new Date().getTime();
        if (move-lastTouchMove >250){
            lastTouchMove=move;
            //disable temp. MotionMove
            lastVMove=move;
            lastHMove=move;
		    dir=2;
            WTGM.move(dir);
        }
    } else
    if(pos.col>mpos.col){//Right
        move = new Date().getTime();
        if (move-lastTouchMove >250){
            lastTouchMove=move;
            //disable temp. MotionMove
            lastVMove=move;
            lastHMove=move;
		    dir=3;
            WTGM.move(dir);
        }
    }
 */

/* Touch Motion */
/*
var lastVTouchMove=0; //Vertical Move
var lastHTouchMove=0; //Horizontal Move
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', deviceMotionHandler, false);
}
*/

function touchEndHandler() {
  WTGM.handleTouchEnd();
}

function touchHandler(event) {
  WTGM.handleTouch(event.pageX, event.pageY);
	/*
	var pos = WTGM.translatePixelsToMatrix(eventData.pageX, eventData.pageY);
  	var mpos = WTGM.handleTouch();
  	if (!pos||!mpos){
  		return;
  	}

    if(pos.row<mpos.row){//Up
        move = new Date().getTime();
        if (move-lastVTouchMove >250){
            lastVTouchMove=move;
		    dir=0;
            WTGM.move(dir);
        }
    }
    if(pos.row>mpos.row){//Down
        move = new Date().getTime();
        if (move-lastVTouchMove >250){
            lastVTouchMove=move;
		    dir=1;
            WTGM.move(dir);
        }
    }
    if(pos.col<mpos.col){ //Left
        move = new Date().getTime();
        if (move-lastHTouchMove >250){
            lastHTouchMove=move;
		    dir=2;
            WTGM.move(dir);
        }
    }
    if(pos.col>mpos.col){//Right
        move = new Date().getTime();
        if (move-lastHTouchMove >250){
            lastHTouchMove=move;
		    dir=3;
            WTGM.move(dir);
        }
    }


  */
}
