export default function wtBalloon(balloonNumber, x, y, speed, WTGM) {
  this.balloonNumber = balloonNumber;
  this.verticalOffset = 0;
  this.horizontalOffset = 0;
  this.width = 64;
  this.height = 64;
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.waveSize = (Math.random() * 20) + 4;
  this.origX = this.x;
  this.remove = 0;
  this.pauseFrame = 0;
  switch (this.balloonNumber) {
    case 0:
      this.verticalOffset = 0;
      this.horizontalOffset = 0;
      this.width = 64;
      this.height = 64;
      break;
    case 1:
      this.verticalOffset = 178;
      this.horizontalOffset = 0;
      this.width = 32;
      this.height = 64;
      break;
    case 2:
      this.verticalOffset = 356;
      this.horizontalOffset = 0;
      this.width = 32;
      this.height = 64;
      break;
    case 3:
      this.verticalOffset = 534;
      this.horizontalOffset = 0;
      this.width = 32;
      this.height = 64;
      break;
    case 4:
      this.verticalOffset = 712;
      this.horizontalOffset = 0;
      this.width = 64;
      this.height = 64;
      break;
    case 5:
      this.verticalOffset = 890;
      this.horizontalOffset = 0;
      this.width = 32;
      this.height = 64;
      break;
    case 6:
      this.verticalOffset = 1068;
      this.horizontalOffset = 0;
      this.width = 64;
      this.height = 64;
      break;
    case 7:
      this.verticalOffset = 1246;
      this.horizontalOffset = 0;
      this.width = 64;
      this.height = 64;
      break;
  }
  this.lastUpdate = new Date().getTime();
  this.score = (30000 * this.speed) / this.width;
  this.slowFps = 0;
	/*
	if (!width){
			width='64';
		}
		if (!height){
			height='64';
		}
		if (!verticalOffset){
			verticalOffset='0';
		}
		if (!horizontalOffset){
			horizontalOffset='0';
		}
		this.img = img;
		this.verticalOffset = verticalOffset;
		this.horizontalOffset = horizontalOffset;
		this.width = width;
		this.height = height;
		*/
  /* TODO auf Spritesheets umstellen
  if (this.img=='m1s'){
    this.verticalOffset = '0';
    this.horizontalOffset = '0';
    this.img= 'sprites';
  } else if (this.img=='m1r') {
    this.verticalOffset = '139';
    this.horizontalOffset = '0';
    this.img= 'sprites';
  }else if (this.img=='a1s') {
    this.verticalOffset = '278';
    this.horizontalOffset = '0';
    this.img= 'sprites';
  }else if (this.img=='m1l') {
    this.verticalOffset = '0';
    this.horizontalOffset = '139';
    this.img= 'sprites';
  }else if (this.img=='e1') {
    this.verticalOffset = '139';
    this.horizontalOffset = '139';
    this.img= 'sprites';
  }
  */
  /* }else if (this.img=='') {
    this.verticalOffset = '';
    this.horizontalOffset = '';
  }else if (this.img=='') {
    this.verticalOffset = '';
    this.horizontalOffset = '';
  }
  */

  this.draw = function (context) {
    // var tex = new Image();
    // if (this.img=='sprites'){
    //	var test;
    // }
    // tex.src = 'res/img/' + this.img + '.png';
    context.drawImage(WTGM.tex, this.horizontalOffset, this.verticalOffset, this.width * 2, this.height * 2, this.x, this.y, this.width, this.height);
  };

  this.update = function () {
    if (!WTGM.paused) {
      let time = new Date().getTime();
      let lastFrameTime = time - this.lastUpdate;

      if (lastFrameTime < 90) { // || this.slowFps){ //entspricht 11 FPS
        this.y -= (time - this.lastUpdate) * speed / 10;
        this.x = this.waveSize * Math.sin(time * 0.002) + this.origX;
        this.lastUpdate = time;
      } else {
        this.pauseFrame++;
      }
      if (this.pauseFrame > 5) {
        this.lastUpdate = time;
        this.pauseFrame = 0;
      }
			/*
			if (lastFrameTime>90){
				this.slowFps = 1;
			}else{
				this.slowFps = 0;
			}
			*/


      if (this.y < -this.width) {
        this.remove = 1;
        WTGM.life -= 1;
      }

			/*
			var time = new Date().getTime();
			if (time-this.lastUpdate>=this.updateThreshold ){
				this.y-=this.speed;
				if (this.y<(0-this.height)){
					this.remove = true;
				}
			}
			*/
    }
  };

  this.isInside = function (x, y) {
    if (this.remove) {
      return false;
    }
    if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
      return true;
    }
    return false;
  };
}
