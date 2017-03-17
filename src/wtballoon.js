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
    default:
      this.verticalOffset = 1246;
      this.horizontalOffset = 0;
      this.width = 64;
      this.height = 64;
      break;
  }
  this.lastUpdate = new Date().getTime();
  this.score = (30000 * this.speed) / this.width;
  this.slowFps = 0;

  this.draw = function (context) {
    context.drawImage(WTGM.tex, this.horizontalOffset, this.verticalOffset,
      this.width * 2, this.height * 2, this.x, this.y, this.width, this.height);
  };

  this.update = function () {
    if (!WTGM.paused) {
      const time = new Date().getTime();
      const lastFrameTime = time - this.lastUpdate;

      if (lastFrameTime < 90) { // || this.slowFps){ //entspricht 11 FPS
        this.y -= ((time - this.lastUpdate) * speed) / 10;
        this.x = (this.waveSize * Math.sin(time * 0.002)) + this.origX;
        this.lastUpdate = time;
      } else {
        this.pauseFrame += 1;
      }
      if (this.pauseFrame > 5) {
        this.lastUpdate = time;
        this.pauseFrame = 0;
      }

      if (this.y < -this.width) {
        this.remove = 1;
        WTGM.life -= 1;
      }
    }
  };

  this.isInside = function (xP, yP) {
    if (this.remove) {
      return false;
    }
    if (xP > this.x && xP < this.x + this.width && yP > this.y && yP < this.y + this.height) {
      return true;
    }
    return false;
  };
}
