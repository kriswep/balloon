export default function WtMessage(message, x, y, color, WTGM) {
  this.message = message;
  this.color = color;
  this.x = x;
  this.y = y;
  this.remove = 0;
  this.insertTime = new Date().getTime();


  this.draw = () => {
    WTGM.Draw.text(this.message, this.x, this.y, 24, this.color);
  };

  this.update = function update() {
    const time = new Date().getTime();
    if (time - this.insertTime > 700) {
      this.remove = 1;
    }
  };

  this.isInside = () => false;
}
