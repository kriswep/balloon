/* globals window document Image localStorage */

import $ from 'jquery/dist/jquery.min';
import wtBalloon from './wtballoon';
import wtMessage from './wtmessage';
import requestAnimFrame from './helpers/animationFrame';

const WTGM = {
  // set up some inital values
  WIDTH: 320,
  HEIGHT: 480,
  scale: 1,
  // the position of the canvas
  // in relation to the screen
  offset: { top: 0, left: 0 },
  paused: 1,
  score: 0,
  highsore: 0,
  highscoreBroken: 0,
  mode: 3,
  life: 2,
  lastPos: -1,
  lastScore: -1,
  // The question
  // question : "2 + _ = 5",
  // The answers
  // answers : [ 2, 3, 5 ],
  // rightAnswer : 1,
  message: [],
  // Tile map matrix->Level
  objects: [], // : g_level1_1,
  createObjectTime: 0,
  //  texture
  tex: new Image(),
  texSrc: './img/sprite.png',
  back: new Image(),
  backSrc: './img/back.png',
  showFps: 0,
  fps: 0,
  lastFrame: 0,
  touching: 0,
  touchHit: 0,
  touchStart: 0,
  touchX: 0,
  touchY: 0,

  // Zoom helper, 3 zoom levels supported
  zoomHelper: {
    level: 1,
    NORMAL: 1,
    FAR: 0.50,
    CLOSE: 2,
  },
  // Scroll position helper, keeps track of scrolling
  scrollPosition: { x: 0, y: 0 },
  // Tile texture
  tile: null,

  // Grid dimensions
  grid: {
    width: 15,
    height: 10,
  },

  // we'll set the rest of these
  // in the init function
  RATIO: null,
  currentWidth: null,
  currentHeight: null,
  canvas: null,
  ctx: null,
  keys: {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    Z: 90,
    X: 88,
    R: 82,
  },


  init(preloadResources) {
    // the proportion of width to height
    WTGM.RATIO = WTGM.WIDTH / WTGM.HEIGHT;
    // these will change when the screen is resize
    WTGM.currentWidth = WTGM.WIDTH;
    WTGM.currentHeight = WTGM.HEIGHT;
    // WTGM is our canvas element
    WTGM.canvas = document.getElementsByTagName('canvas')[0];
    // it's important to set WTGM
    // otherwise the browser will
    // default to 320x200
    WTGM.canvas.width = WTGM.WIDTH;
    WTGM.canvas.height = WTGM.HEIGHT;
    // the canvas context allows us to
    // interact with the canvas api
    WTGM.ctx = WTGM.canvas.getContext('2d');

    /* Preload!! */
    preloadResources(WTGM.canvas, () => {
      WTGM.tex.src = WTGM.texSrc;
      WTGM.back.src = WTGM.backSrc;
      // Set Up tiles
      // WTGM.tile = new Image();
      // WTGM.tile.src = "res/img/tile32x32.png";
      // WTGM.tile.width *= WTGM.zoomHelper.level;
      // WTGM.tile.height *= WTGM.zoomHelper.level;

      WTGM.resize();// we're ready to resize


      // WTGM.generateBalloon();

      WTGM.loop();
    });
  },


  resize() {
    WTGM.currentHeight = window.innerHeight;

    // resize the width in proportion
    // to the new height
    WTGM.currentWidth = WTGM.currentHeight * WTGM.RATIO;

    // set the new canvas style width & height
    // note: our canvas is still 320x480 but
    // we're essentially scaling it with CSS
    WTGM.canvas.style.width = `${WTGM.currentWidth}px`;
    WTGM.canvas.style.height = `${WTGM.currentHeight}px`;

    // the amount by which the css resized canvas
    // is different to the actual (480x320) size.
    WTGM.scale = WTGM.currentWidth / WTGM.WIDTH;
    // position of canvas in relation to
    // the screen
    WTGM.offset.top = WTGM.canvas.offsetTop;
    WTGM.offset.left = WTGM.canvas.offsetLeft;

    // we use a timeout here as some mobile
    // browsers won't scroll if there is not
    // a small delay
    window.setTimeout(() => {
      window.scrollTo(0, 1);
    }, 1);
  },

  handleMouseDown(x, y) {

  },

  translatePixels(x, y) {
    this.x = (x - WTGM.offset.left) / WTGM.scale;
    this.y = (y - WTGM.offset.top) / WTGM.scale;

    return {
      x: this.x,
      y: this.y,
    };
  },

  /**
   * Touch and Mouse-Click
   *
   * @param {any} x
   * @param {any} y
   */
  handleTouch(x, y) {
    // var hit = 0;
    let pos = WTGM.translatePixels(x, y);
    WTGM.touchX = pos.x;
    WTGM.touchY = pos.y;
    let time = new Date().getTime();
    let addScore = 0;
    if (time - WTGM.touchStart > 300) {
      // Zeit um Bonus zu bekommen!
      WTGM.handleTouchEnd();
    }
    // Hit?
    if (WTGM.touching) {
      for (let i = 0; i < WTGM.objects.length; i++) {
        if (WTGM.objects[i].isInside(pos.x, pos.y)) {
          if (time - WTGM.touchStart <= 300) {
            // Zeit um Bonus zu bekommen!
            WTGM.hit += 1;
          } else {
            WTGM.hit = 1;
          }
          addScore = WTGM.objects[i].score * WTGM.hit;
          WTGM.score += addScore;
          WTGM.objects[i].remove = true;
          if (WTGM.hit > 1) {
            var message = new wtMessage(`+${Math.round(addScore / 100)}(x${WTGM.hit})`, pos.x, pos.y, '#118811', WTGM);
          } else {
            var message = new wtMessage(`+${Math.round(addScore / 100)}`, pos.x, pos.y, '#118811', WTGM);
          }
          WTGM.objects.push(message);
        } else {
        }
      }
      if (!WTGM.highscoreBroken && Math.round(WTGM.score / 100) > WTGM.highsore) {
        var message = new wtMessage('Neuer Highscore!', WTGM.touchX, WTGM.touchY - 25, '#118811', WTGM);
        WTGM.objects.push(message);
        WTGM.highscoreBroken = 1;
      }
    }
  },

  handleTouchEnd() {
    if (WTGM.touching && !WTGM.paused) {
      if (!WTGM.hit) {
        // var pos = WTGM.translatePixels(x,y);
        if (WTGM.score - 1000 > 0) {
          WTGM.score -= 1000;
          let message = new wtMessage('-10', WTGM.touchX, WTGM.touchY, '#881111', WTGM);
          WTGM.objects.push(message);
          if (WTGM.highscoreBroken && Math.round(WTGM.score / 100) < WTGM.highsore) {
            message = new wtMessage('Highscore verloren!', WTGM.touchX, WTGM.touchY - 25, '#881111', WTGM);
            WTGM.objects.push(message);
            WTGM.highscoreBroken = 0;
          }
        }
      }
      WTGM.hit = 0;
      WTGM.touchStart = 0;
      WTGM.touching = 0;
    }
  },

  startGame() {
    WTGM.message = [];
    WTGM.createObjectTime = 0;
    WTGM.objects = [];
    WTGM.score = 0;
    WTGM.life = 2 * WTGM.mode;
    WTGM.paused = 0;

    WTGM.highsore = localStorage.getItem(1);
  },


  endGame() {
    // WTGM.message = new Array();
    // WTGM.createObjectTime = 0;
    // WTGM.objects = new Array();
    // WTGM.score = 0;
    // WTGM.life = 2*WTGM.mode;
    WTGM.paused = 1;
    $('.startGame').text('Spiel starten');

    $('.inGameOption').hide();
    $('.inMenuOption').show();
    $('.ui').removeClass('gameRunning');
    $('.ui').show();
    $('.openMenu').hide();

    WTGM.setScore();
  },
  setScore() {
    WTGM.lastPos = -1;
    WTGM.lastScore = Math.round(WTGM.score / 100);
    let oldScores = new Array();
    let scores = new Array();
    let found = false;
    // Scores auslesen:
    for (let i = 0; i < 10; i++) {
      oldScores[i] = localStorage.getItem(i + 1);
    }
    // Aktuelle Punkte eintragen:
    // Wenn unser Score Highscore ist, kann es 11 Einträge geben, nur 10 werden gespeichert!
    for (let i = 0; i < 11; i++) {
      if (!found) {
        if (WTGM.lastScore > oldScores[i] || oldScores[i] == 'null') {
          scores[i] = WTGM.lastScore;
          found = true;
          WTGM.lastPos = i;
        } else {
          scores[i] = oldScores[i];
        }
      } else {
        scores[i] = oldScores[i - 1];
      }
    }
    // Scores eintragen:
    for (let i = 0; i < 10; i++) {
      localStorage.setItem(i + 1, scores[i]);
    }

  },

  // WTGM is where all entities will be moved
  // and checked for collisions etc
  update() {
    if (WTGM.life <= 0) {
      WTGM.endGame();
    }
    WTGM.generateBalloon();

    // update objects
    WTGM.objects.forEach((object) => {
      object.update();
    });
    // remove
    WTGM.objects = WTGM.objects.filter(object => !object.remove);
  },


  // WTGM is where we draw all the entities
  render(srcX = 0, srcY = 0, destX = WTGM.canvas.width, destY = WTGM.canvas.heigh) {
    WTGM.ctx.clearRect(0, 0, WTGM.canvas.width, WTGM.canvas.height);
    WTGM.ctx.fillStyle = '#2222dd';// '#7c4f22';
    WTGM.ctx.fillRect(0, 0, WTGM.canvas.width, WTGM.canvas.height);
    WTGM.ctx.drawImage(WTGM.back, 0, 0);
    // Objects
    for (let i = 0; i < WTGM.objects.length; i++) {
      WTGM.objects[i].draw(WTGM.ctx);
    }
    // Score
    WTGM.Draw.text(`Punkte: ${Math.round(WTGM.score / 100)}`, 5, 25, 24, '#333');
    WTGM.Draw.text(`Leben: ${WTGM.life}`, 5, 50, 24, '#333');
    // FPS
    if (WTGM.showFps) {
      WTGM.Draw.text(Math.round(WTGM.fps), 5, 440, 24, '#333');
    }
  },

  /**
   * the actual loop
   * requests animation frame
   * then proceeds to update and render
   */
  loop() {
    // order new loop
    requestAnimFrame(WTGM.loop);

    if (!WTGM.paused) {
      WTGM.update();
      WTGM.render();
    }

    if (WTGM.showFps) {
      if (!WTGM.lastFrame) {
        WTGM.lastFrame = new Date().getTime();
        WTGM.fps = 0;
      }
      const time = new Date().getTime();
      const delta = (time - WTGM.lastFrame) / 1000;
      WTGM.lastFrame = time;
      WTGM.fps = 1 / delta;
    }
  },

  /**
   * Generate a random balloon
   *
   */
  generateBalloon() {
    const time = new Date().getTime();
    if (WTGM.createObjectTime <= time) {
      WTGM.createObjectTime = time + Math.floor(Math.random() * 2000) + 500;
      const balloon = new wtBalloon(Math.floor(Math.random() * 8), Math.floor(Math.random() * 256),
        500, Math.floor(Math.random() * 3) + 1, WTGM);
      WTGM.objects.push(balloon);
    }

  },
};

window.WTGM = WTGM;

WTGM.Draw = {

  clear() {
    WTGM.ctx.clearRect(0, 0, WTGM.WIDTH, WTGM.HEIGHT);
  },


  rect(x, y, w, h, col) {
    WTGM.ctx.fillStyle = col;
    WTGM.ctx.fillRect(x, y, w, h);
  },

  circle(x, y, r, col) {
    WTGM.ctx.fillStyle = col;
    WTGM.ctx.beginPath();
    WTGM.ctx.arc(x + 5, y + 5, r, 0, Math.PI * 2, true);
    WTGM.ctx.closePath();
    WTGM.ctx.fill();
  },


  text(string, x, y, size, color) {
    WTGM.ctx.font = `bold ${size}px Monospace`;
    WTGM.ctx.fillStyle = color;
    WTGM.ctx.fillText(string, x, y);
  },

};

export default WTGM;
