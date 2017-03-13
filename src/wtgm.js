import $ from 'jquery/dist/jquery.min';
import wtBalloon from './wtballoon';
import wtMessage from './wtmessage';

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
  message: new Array(),
  // Tile map matrix->Level
  objects: new Array(), // : g_level1_1,
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
	/*
	grid : {
		width: 28,
		height: 19
	},
	*/
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
  ua: null,
  android: null,
  ios: null,
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
  /* Game-specific */
  //		inAir : false,

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
    // we need to sniff out android & ios
    // so we can hide the address bar in
    // our resize function
    WTGM.ua = navigator.userAgent.toLowerCase();
    WTGM.android = WTGM.ua.indexOf('android') > -1;
    WTGM.ios = !!((WTGM.ua.indexOf('iphone') > -1 || WTGM.ua.indexOf('ipad') > -1));


		/*
		// set up our wave effect
		// basically, a series of overlapping circles
		// across the top of screen
		WTGM.wave = {
				x: -25, // x coord of first circle
				y: -40, // y coord of first circle
				r: 50, // circle radius
				time: 0, // we'll use WTGM in calculating the sine wave
				offset: 0 // WTGM will be the sine wave offset
		};

		// calculate how many circles we need to
		// cover the screen width
		WTGM.wave.total = Math.ceil(WTGM.WIDTH / WTGM.wave.r) + 1;

		// listen for clicks
		window.addEventListener('click', function(e) {
				e.preventDefault();
				WTGM.Input.set(e);
		}, false);

		// listen for touches
		window.addEventListener('touchstart', function(e) {
				e.preventDefault();
				// the event object has an array
				// called touches, we just want
				// the first touch
				WTGM.Input.set(e.touches[0]);
		}, false);
		window.addEventListener('touchmove', function(e) {
				// we're not interested in WTGM
				// but prevent default behaviour
				// so the screen doesn't scroll
				// or zoom
				e.preventDefault();
		}, false);
		window.addEventListener('touchend', function(e) {
				// as above
				e.preventDefault();
		}, false);
*/

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

    // WTGM will create some extra space on the
    // page, allowing us to scroll pass
    // the address bar, and thus hide it.
    if (WTGM.ios || WTGM.android) {
      // document.body.style.height = (window.innerHeight + 60) + 'px';
      // WTGM.currentHeight = window.innerHeight + 60;
    }

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
    // var pos = this.translatePixels(x, y);
    // console.log('Row: '+pos.row+', Col: '+pos.col);
		/* if (this.tileMap[pos.row]!=null){
			if (this.tileMap[pos.row][pos.col]!=null){
				this.tileMap[pos.row][pos.col] = "a1";
			}
		}
		*/
  },
	/*
	handleKeyDown : function(e) {

		switch (e.keyCode) {
			case WTGM.keys.UP:
				WTGM.move(0);
				break;
			case WTGM.keys.W:
				WTGM.move(0);
				//WTGM.scrollPosition.y += 20;
				break;
			case WTGM.keys.DOWN:
				WTGM.move(1);
				break;
			case WTGM.keys.S:
				WTGM.move(1);
				//WTGM.scrollPosition.y -= 20;
				break;
			case WTGM.keys.LEFT:
				WTGM.move(2);
				break;
			case WTGM.keys.A:
				WTGM.move(2);
				//WTGM.scrollPosition.x += 20;
				break;
			case WTGM.keys.RIGHT:
				WTGM.move(3);
				break;
			case WTGM.keys.D:
				WTGM.move(3);
				//WTGM.scrollPosition.x -= 20;
				break;
		}

	},

	getMowleePos: function(){
		for (var row = 0; row < WTGM.tileMap.length; row++) {
			for (var col = 0; col < WTGM.tileMap[row].length; col++) {
				if (WTGM.tileMap[row][col]['img'].substring(0,1)=="m"){
						return {
							row: row,
							col: col
						};
				}
			}
		}
		return false;
	},

	move : function(direction){
		if (WTGM.paused){
			return;
		}
		if (!WTGM.inAir || (direction==2||direction==3)){//no Movement

		var found = false;
		for (var row = 0; row < WTGM.tileMap.length; row++) {
			if (found){
				break;
			}
			for (var col = 0; col < WTGM.tileMap[row].length; col++) {
				if (WTGM.tileMap[row][col]['img'].substring(0,1)=="m"){
				var mole = WTGM.tileMap[row][col];
				switch (direction) {
					case 0://Up
						if (WTGM.tileMap[row-1] != null && WTGM.tileMap[row-1][col] != null) {
							var idx = WTGM.tileMap[row-1][col]['img'].indexOf( "_a");
							if ( idx!=-1 ){
								tileMapContent = WTGM.tileMap[row-1][col]['img'];
								var answer = tileMapContent.substring(tileMapContent.length-1,tileMapContent.length);
								if (WTGM.solve(answer)){
									WTGM.tileMap[row][col]['img'] = 'e1';
									WTGM.tileMap[row-1][col]['img'] = 'a1s';
									window.setTimeout(function(){
										WTGM.generateQuestion();
									}, 1000);
								}else{
									window.setTimeout(function(){
										WTGM.setLevel();
									}, 1000);
								};
								break;
							}
							if (WTGM.tileMap[row-1][col]['img'].substring(0,1)!="x" && WTGM.tileMap[row-1][col]['img'].substring(0,1)!="a"){
								WTGM.tileMap[row][col] = WTGM.tileMap[row-1][col];
								//standing
								mole['img']= mole['img'].substring(0,mole['img'].length - 1)+"s"
								WTGM.tileMap[row-1][col] = mole;//"m1";
							}

						}
						break;
					case 1://Down
						if (WTGM.tileMap[row+1] != null && WTGM.tileMap[row+1][col] != null) {
							var idx = WTGM.tileMap[row+1][col]['img'].indexOf( "_a");
							if ( idx!=-1 ){
								tileMapContent = WTGM.tileMap[row+1][col]['img'];
								var answer = tileMapContent.substring(tileMapContent.length-1,tileMapContent.length);
								if (WTGM.solve(answer)){
									WTGM.tileMap[row][col]['img'] = 'e1';
									WTGM.tileMap[row-1][col]['img'] = 'a1s';
									window.setTimeout(function(){
										WTGM.generateQuestion();
									}, 1000);
								}else{
									window.setTimeout(function(){
										WTGM.setLevel();
									}, 1000);
								};
								break;
							}
							if (WTGM.tileMap[row+1][col]['img'].substring(0,1)!="x" && WTGM.tileMap[row+1][col]['img'].substring(0,1)!="a"){
								WTGM.tileMap[row][col] = WTGM.tileMap[row+1][col];
								//standing
								mole['img']= mole['img'].substring(0,mole['img'].length - 1)+"s"
								WTGM.tileMap[row+1][col] = mole;//"m1";
							}
						}
						break;
					case 2://Left
						if (WTGM.tileMap[row] != null && WTGM.tileMap[row][col-1] != null) {
							var idx = WTGM.tileMap[row][col-1]['img'].indexOf( "_a");
							if ( idx!=-1 ){
								tileMapContent = WTGM.tileMap[row][col-1]['img'];
								var answer = tileMapContent.substring(tileMapContent.length-1,tileMapContent.length);
								if (WTGM.solve(answer)){
									WTGM.tileMap[row][col]['img'] = 'e1';
									WTGM.tileMap[row-1][col]['img'] = 'a1s';
									window.setTimeout(function(){
										WTGM.generateQuestion();
									}, 1000);
								}else{
									window.setTimeout(function(){
										WTGM.setLevel();
									}, 1000);
								};
								break;
							}
							if (WTGM.tileMap[row][col-1]['img'].substring(0,1)!="x"){
								WTGM.tileMap[row][col] = WTGM.tileMap[row][col-1];
								//Turn left
								mole['img']= mole['img'].substring(0,mole['img'].length - 1)+"l"
								WTGM.tileMap[row][col-1] = mole;//"m1";
							}
						}
						break;
					case 3://Right
						if (WTGM.tileMap[row] != null && WTGM.tileMap[row][col+1] != null) {
							var idx = WTGM.tileMap[row][col+1]['img'].indexOf( "_a");
							if ( idx!=-1 ){
								tileMapContent = WTGM.tileMap[row][col+1]['img'];
								var answer = tileMapContent.substring(tileMapContent.length-1,tileMapContent.length);
								if (WTGM.solve(answer)){
									WTGM.tileMap[row][col]['img'] = 'e1';
									WTGM.tileMap[row-1][col]['img'] = 'a1s';
									window.setTimeout(function(){
										WTGM.generateQuestion();
									}, 1000);
								}else{
									window.setTimeout(function(){
										WTGM.setLevel();
									}, 1000);
								};
								break;
							}
							if (WTGM.tileMap[row][col+1]['img'].substring(0,1)!="x"){
								WTGM.tileMap[row][col] = WTGM.tileMap[row][col+1];
								//Turn right
								mole['img']= mole['img'].substring(0,mole['img'].length - 1)+"r"
								WTGM.tileMap[row][col+1] = mole;//"m1";
							}
						}
						break;
				}
				found = true;
				break;
				}
			}
		}

		WTGM.checkPosition();
		}

	},
	*/

	/**
	 * PositionsCheck
	 *
	 */
	/*
	checkPosition : function(lastDate){
		var currentDate = new Date();
		var diff = 0;
		if (lastDate == null){
			lastDate = currentDate;
		}
		var currentTime = currentDate.getTime();
		var lastTime = lastDate.getTime();

		diff = Math.abs(currentTime - lastTime);


		if ( (WTGM.inAir && diff > 85) || !WTGM.inAir) {
		var found = false;
		for (var row = 0; row < WTGM.tileMap.length; row++) {
			if (found){
				break;
			}
			for (var col = 0; col < WTGM.tileMap[row].length; col++) {
				if (WTGM.tileMap[row][col]['img'].substring(0,1)=="m"){
						var mole = WTGM.tileMap[row][col];
						if (WTGM.tileMap[row+1] != null && WTGM.tileMap[row+1][col] != null) {
							if (WTGM.tileMap[row+1][col]['img'].substring(0,1)=="a"){
								WTGM.tileMap[row][col] = WTGM.tileMap[row+1][col];
								WTGM.tileMap[row+1][col] = mole;//"m1";
								WTGM.inAir = true;
								//alert("Air");

							} else {
								WTGM.inAir = false;
							}
						}

						found = true;
						break;
				}
			}
		}
		} else {
			currentDate = lastDate;
		}


			if (WTGM.inAir) {
				var thisG = this;
				setTimeout(function() {
					thisG.checkPosition(currentDate);
				}, 1);
			}


	},
	*/

  translatePixels(x, y) {
    // var tileHeight = this.tile.height * this.zoomHelper.level;
    // var tileWidth = this.tile.width * this.zoomHelper.level;

    // var gridOffsetY = this.scrollPosition.y;
    // var gridOffsetX = this.scrollPosition.x;

    // By default the grid appears centered horizontally
    // gridOffsetX += (this.canvas.width / 2) - ((tileWidth / 2) * this.zoomHelper.level) + this.scrollPosition.x;

    this.x = (x - WTGM.offset.left) / WTGM.scale;
    this.y = (y - WTGM.offset.top) / WTGM.scale;

    // Canvas-Offset abziehen
    // col -= WTGM.offset.left;
    // row -= WTGM.offset.top;

    // col = Math.floor(col / tileWidth);
    // row = Math.floor(row / tileHeight);


    return {
      x: this.x,
      y: this.y,
    };

		/*
		var tileHeight = this.tile.height * this.zoomHelper.level;
		var tileWidth = this.tile.width * this.zoomHelper.level;

		var gridOffsetY = this.scrollPosition.y;
		var gridOffsetX = this.scrollPosition.x;

		// By default the grid appears centered horizontally
		//gridOffsetX += (this.canvas.width / 2) - ((tileWidth / 2) * this.zoomHelper.level) + this.scrollPosition.x;

		var col = x + gridOffsetX;
		var row = y + gridOffsetY;

		//Canvas-Offset abziehen
		col -= WTGM.offset.left;
		row -= WTGM.offset.top;

		col = Math.floor(col / tileWidth);
		row = Math.floor(row / tileHeight);



		return {
			row: row,
			col: col
		};
		 */

		/*
		var tileHeight = WTGM.tile.height * WTGM.zoomHelper.level;
		var tileWidth = WTGM.tile.width * WTGM.zoomHelper.level;

		var gridOffsetY = (WTGM.grid.height * WTGM.zoomHelper.level) + WTGM.scrollPosition.y;
		var gridOffsetX = (WTGM.grid.width * WTGM.zoomHelper.level);

		// By default the grid appears centered horizontally
		gridOffsetX += (WTGM.canvas.width / 2) - ((tileWidth / 2) * WTGM.zoomHelper.level) + WTGM.scrollPosition.x;

		var col = (2 * (y - gridOffsetY) - x + gridOffsetX) / 2;
		var row = x + col - gridOffsetX - tileHeight;

		col = Math.round(col / tileHeight);
		row = Math.round(row / tileHeight);

		return {
			row: row,
			col: col
		};
		*/
  },

	/**
	 *
	 * Touch and Mouse-Click
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
		/*
		if (!WTGM.hit){
			if (WTGM.score-1000 > 0){
				WTGM.score-=1000;
				var message = new wtMessage('-10',pos.x,pos.y,'#aa3333', WTGM);
					WTGM.objects.push(message);
			}
		}
		*/
  },

  handleTouchEnd() {
    if (WTGM.touching && !WTGM.paused) {
      if (!WTGM.hit) {
        // var pos = WTGM.translatePixels(x,y);
        if (WTGM.score - 1000 > 0) {
          WTGM.score -= 1000;
          var message = new wtMessage('-10', WTGM.touchX, WTGM.touchY, '#881111', WTGM);
          WTGM.objects.push(message);
          if (WTGM.highscoreBroken && Math.round(WTGM.score / 100) < WTGM.highsore) {
            var message = new wtMessage('Highscore verloren!', WTGM.touchX, WTGM.touchY - 25, '#881111', WTGM);
            WTGM.objects.push(message);
            WTGM.highscoreBroken = 0;
          }
        }
      }
      WTGM.hit = 0;
      WTGM.touchStart = 0,
        WTGM.touching = 0;
    }
  },

  startGame() {
    WTGM.message = new Array();
    WTGM.createObjectTime = 0;
    WTGM.objects = new Array();
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
    for (var i = 0; i < 10; i++) {
      oldScores[i] = localStorage.getItem(i + 1);
    }
    // Aktuelle Punkte eintragen:
    for (var i = 0; i < 11; i++) { // Wenn unser Score Highscore ist, kann es 11 Eintr�ge geben, nur 10 werden gespeichert!
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
    for (var i = 0; i < 10; i++) {
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
    for (let i = 0; i < WTGM.objects.length; i++) {
      WTGM.objects[i].update();

      if (WTGM.objects[i].remove) {
        WTGM.objects.splice(i, 1);
      }
    }
  },


  // WTGM is where we draw all the entities
  render(srcX, srcY, destX, destY) {
    srcX = (srcX === undefined) ? 0 : srcX;
    srcY = (srcY === undefined) ? 0 : srcY;
    destX = (destX === undefined) ? WTGM.canvas.width : destX;
    destY = (destY === undefined) ? WTGM.canvas.height : destY;

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
		/*
		var pos_TL = WTGM.translatePixelsToMatrix(1, 1);
		var pos_BL = WTGM.translatePixelsToMatrix(1, WTGM.canvas.height);
		var pos_TR = WTGM.translatePixelsToMatrix(WTGM.canvas.width, 1);
		var pos_BR = WTGM.translatePixelsToMatrix(WTGM.canvas.width, WTGM.canvas.height);

		var startRow = pos_TL.row;
		var startCol = pos_TR.col;
		var rowCount = pos_BR.row + 1;
		var colCount = pos_BL.col + 1;
		*/

		/*
		var startRow = 0;
		var startCol = 0;
		var rowCount = WTGM.grid.width;
		var colCount = WTGM.grid.height;

		startRow = (startRow < 0) ? 0 : startRow;
		startCol = (startCol < 0) ? 0 : startCol;

		rowCount = (rowCount > WTGM.grid.width) ? WTGM.grid.width : rowCount;
		colCount = (colCount > WTGM.grid.height) ? WTGM.grid.height : colCount;

		var tileHeight = WTGM.tile.height * WTGM.zoomHelper.level;
		var tileWidth = WTGM.tile.width * WTGM.zoomHelper.level;


		for (var row = startRow; row < rowCount; row++) {
			for (var col = startCol; col < colCount; col++) {

				var xpos = col * tileWidth;
				//xpos += ((tileWidth / 2) * WTGM.zoomHelper.level) + WTGM.scrollPosition.x;
				xpos += WTGM.scrollPosition.x;

				//var ypos = row * (tileHeight) + (WTGM.grid.height * WTGM.zoomHelper.level) + WTGM.scrollPosition.y;
				var ypos = row * (tileHeight) + WTGM.scrollPosition.y;

				if (Math.round(xpos) + tileWidth >= srcX &&
					Math.round(ypos) + tileHeight >= srcY &&
					Math.round(xpos) <= destX &&
					Math.round(ypos) <= destY) {

//	    				WTGM.ctx.drawImage(WTGM.tile, Math.round(xpos), Math.round(ypos), tileWidth, tileHeight);

					if (WTGM.tileMap[row] != null && WTGM.tileMap[row][col] != null) {
						var tileMapContent = WTGM.tileMap[row][col]['img'];
						var idx = WTGM.tileMap[row][col]['img'].indexOf( "_q");
						if ( idx!=-1 ){
							//Dann ist das ein Fragefeld!
							tileMapContent = tileMapContent.substring(0,idx);
							WTGM.ctx.fillStyle = '#222';
							WTGM.ctx.font = "bold 48px sans-serif";
							WTGM.ctx.fillText(WTGM.question, Math.round(xpos), Math.round(ypos)-tileHeight);
						}
						idx = WTGM.tileMap[row][col]['img'].indexOf( "_a");
						if ( idx!=-1 ){
							//Dann ist das ein Antwortfeld!
							var answer = tileMapContent.substring(tileMapContent.length-1,tileMapContent.length);
							tileMapContent = tileMapContent.substring(0,idx);
							WTGM.ctx.fillStyle = '#222';
							WTGM.ctx.font = "bold 24px sans-serif";
							WTGM.ctx.fillText(WTGM.answers[answer], Math.round(xpos), Math.round(ypos));
						}
						idx = WTGM.tileMap[row][col]['img'].indexOf( "_t");
						if ( idx!=-1 ){
							//Dann ist das ein Nachrichtenfeld!

							tileMapContent = tileMapContent.substring(0,idx);
							var time = new Date().getTime();
							if (WTGM.message['visible']&&time-WTGM.message['time']<2000){
								WTGM.ctx.fillStyle = WTGM.message['color'];
								WTGM.ctx.font = "bold 18px sans-serif";
								WTGM.ctx.fillText(WTGM.message['text'], Math.round(xpos), Math.round(ypos)-tileHeight);
							}
						}


							WTGM.tex.src = WTGM.texSrc + tileMapContent + '.png';
							WTGM.ctx.drawImage(WTGM.tex, Math.round(xpos), Math.round(ypos), tileWidth, tileHeight);
							//
							//WTGM.tileMap[row][col].draw(WTGM.ctx, Math.round(xpos), Math.round(ypos));

					}
				}
			}
		}
		*/
  },


  // the actual loop
  // requests animation frame
  // then proceeds to update
  // and render
  loop() {
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
      let time = new Date().getTime();
      let delta = (time - WTGM.lastFrame) / 1000;
      WTGM.lastFrame = time;
      WTGM.fps = 1 / delta;
    }
  },


	/**
	 * Generate a random balloon
	 */
  generateBalloon() {
    let time = new Date().getTime();
    if (WTGM.createObjectTime <= time) {
      WTGM.createObjectTime = time + Math.floor(Math.random() * 2000) + 500;
      let balloon = new wtBalloon(Math.floor(Math.random() * 8), Math.floor(Math.random() * 256), 500, Math.floor(Math.random() * 3) + 1, WTGM);
      WTGM.objects.push(balloon);
    }

  },
};

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
