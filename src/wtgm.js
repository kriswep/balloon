/* globals window document Image localStorage */
import WtBalloon from './wtballoon';
import WtMessage from './wtmessage';
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
  baby: 0,

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

  // handleMouseDown(x, y) {

  // },

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
    const pos = WTGM.translatePixels(x, y);
    const time = new Date().getTime();
    let addScore = 0;
    WTGM.touchX = pos.x;
    WTGM.touchY = pos.y;
    if (time - WTGM.touchStart > 300) {
      // Zeit um Bonus zu bekommen ist vorbei!
      WTGM.touchStart = time;
      WTGM.hit = 0;
    }
    // Hit?
    if (WTGM.touching) {
      // [].re
      WTGM.objects = WTGM.objects.reduce((newObjects, object) => {
        const newObject = Object.assign({}, object);
        if (newObject.isInside(pos.x, pos.y)) {
          // if (time - WTGM.touchStart <= 300) {
          // Zeit um Bonus zu bekommen!
          WTGM.hit += 1;
          // } else {
          //   WTGM.hit = 1;
          // }
          addScore = newObject.score * WTGM.hit;
          WTGM.score += addScore;
          newObject.remove = true;
          if (WTGM.hit > 1) {
            const message = new WtMessage(`+${Math.round(addScore / 100)}(x${WTGM.hit})`, pos.x, pos.y, '#118811', WTGM);
            newObjects.push(message);
          } else {
            const message = new WtMessage(`+${Math.round(addScore / 100)}`, pos.x, pos.y, '#118811', WTGM);
            newObjects.push(message);
          }
        }
        newObjects.push(newObject);
        return newObjects;
      }, []);

      if (!WTGM.highscoreBroken && Math.round(WTGM.score / 100) > WTGM.highsore) {
        const message = new WtMessage('HIGHSCORE!', WTGM.touchX, WTGM.touchY - 25, '#118811', WTGM);
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
          let message = new WtMessage('-10', WTGM.touchX, WTGM.touchY, '#881111', WTGM);
          WTGM.objects.push(message);
          if (WTGM.highscoreBroken && Math.round(WTGM.score / 100) < WTGM.highsore) {
            message = new WtMessage('Highscore lost!', WTGM.touchX, WTGM.touchY - 25, '#881111', WTGM);
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
    WTGM.paused = 1;
    document.querySelector('.startGame').textContent = 'Play';
    document.querySelector('.inGameOption').style.display = 'none';
    document.querySelector('.ui').classList.remove('gameRunning');
    document.querySelector('.ui').style.display = '';
    document.querySelector('.openMenu').style.display = 'none';

    WTGM.setScore();
  },

  setScore() {
    WTGM.lastPos = -1;
    WTGM.lastScore = Math.round(WTGM.score / 100);
    const oldScores = [];
    const scores = [];
    let found = false;
    // Scores auslesen:
    for (let i = 0; i < 10; i += 1) {
      oldScores[i] = localStorage.getItem(i + 1);
    }
    // Aktuelle Punkte eintragen:
    // Wenn unser Score Highscore ist, kann es 11 Einträge geben, nur 10 werden gespeichert!
    for (let i = 0; i < 11; i += 1) {
      if (!found) {
        if (WTGM.lastScore > oldScores[i] || oldScores[i] === 'null') {
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
    for (let i = 0; i < 10; i += 1) {
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
  render() {
    WTGM.ctx.clearRect(0, 0, WTGM.canvas.width, WTGM.canvas.height);
    WTGM.ctx.fillStyle = '#2222dd';// '#7c4f22';
    WTGM.ctx.fillRect(0, 0, WTGM.canvas.width, WTGM.canvas.height);
    WTGM.ctx.drawImage(WTGM.back, 0, 0);
    // Objects
    for (let i = 0; i < WTGM.objects.length; i += 1) {
      WTGM.objects[i].draw(WTGM.ctx);
    }
    // Score
    WTGM.Draw.text(`Points: ${Math.round(WTGM.score / 100)}`, 5, 25, 24, '#333');
    WTGM.Draw.text(`Life: ${WTGM.life}`, 5, 50, 24, '#333');
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
    // if (WTGM.createObjectTime <= time) {
    //   WTGM.createObjectTime = time + Math.floor(Math.random() * 2000) + 500;
    //   const balloon = new WtBalloon(Math.floor(Math.random() * 8),
    //     Math.floor(Math.random() * 256), 500, Math.floor(Math.random() * 3) + 1, WTGM);
    //   WTGM.objects.push(balloon);
    // }

    let balloonCreateRand = 2000;
    let balloonCreateConst = 500;
    let balloonSpeedRand = 3;
    const balloonSpeedConst = 1;

    if (WTGM.baby) {
      balloonCreateRand = 3000;
      balloonCreateConst = 1000;
      balloonSpeedRand = 1;
    }
    if (WTGM.createObjectTime <= time) {
      WTGM.createObjectTime = time
        + Math.floor(Math.random() * balloonCreateRand)
        + balloonCreateConst;
      const balloon = new WtBalloon(Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 256),
        500,
        Math.floor(Math.random() * balloonSpeedRand) + balloonSpeedConst,
        WTGM);
      WTGM.objects.push(balloon);
    }
  },

  /**
   * decrease life by quantity
   *
   * @param {number} [quantity=1]
   */
  decreaseLife(quantity = 1) {
    WTGM.life -= quantity;
  },

  /**
   * toggle the easier baby mode
   *
   */
  toggleBaby() {
    if (WTGM.baby) {
      WTGM.baby = 0;
      WTGM.mode = 3;
    } else {
      WTGM.baby = 1;
      WTGM.mode = 50;
    }
    WTGM.endGame();
  },
};

// window.WTGM = WTGM;

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
