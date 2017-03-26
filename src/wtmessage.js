export default function WtMessage(message, x, y, color, WTGM) {
  return {
    message,
    color,
    x,
    y,
    remove: 0,
    insertTime: new Date().getTime(),
    draw() {
      WTGM.Draw.text(this.message, this.x, this.y, 24, this.color);
    },
    update() {
      const time = new Date().getTime();
      if (time - this.insertTime > 700) {
        this.remove = 1;
      }
    },
    isInside() {
      return false;
    },
  };
}
