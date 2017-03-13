export default function wtMessage(message, x, y, color, WTGM) {
  this.message = message;
  this.color = color;
  this.x = x;
  this.y = y;
  this.remove = 0;
  this.insertTime = new Date().getTime();


  this.draw = function (context) {
    // var tex = new Image();
    // if (this.img=='sprites'){
    //	var test;
    // }
    // tex.src = 'res/img/' + this.img + '.png';
    WTGM.Draw.text(this.message, this.x, this.y, 24, this.color);
    // context.drawImage(WTGM.tex, this.verticalOffset, this.horizontalOffset, this.width*2, this.height*2, this.x, this.y, this.width, this.height);
  };

  this.update = function () {
    let time = new Date().getTime();
    if (time - this.insertTime > 700) {
      this.remove = 1;
    }
  };

  this.isInside = function (x, y) {
    return false;
  };
}
