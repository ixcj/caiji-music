import { randomRange } from '@/utils/random'

const PI2 = 2 * Math.PI;

class Triangle {
  constructor(context, speed, pole, range) {
    this.ctx = context;
    this.pole = pole;
    this.range = range;
    this.speed = speed;
    this.points = [[0, 0], [0, 0], [0, 0]];
    this.__restart();
  }

  __restart() {
    this.angle = Math.random() * PI2;
    this.speedX = Math.cos(this.angle) * this.speed * randomRange(0.5, 1.5);
    this.speedY = Math.sin(this.angle) * this.speed * randomRange(0.5, 1.5);
    this.opacity = 1;

    const dist = Math.random() * 75;
    const distX = Math.cos(this.angle) * dist;
    const distY = Math.sin(this.angle) * dist;
    const θ = Math.random() * PI2;
    const x2 = Math.random() * 10;
    const y2 = 20 + Math.random() * 20;
    const x3 = 10 + Math.random() * 15;
    const y3 = 12 + Math.random() * 6;
    this.points[0][0] = Math.floor(this.pole[0] + distX);
    this.points[0][1] = Math.floor(this.pole[1] + distY);
    this.points[1][0] = Math.floor(this.pole[0] + distX + (x2 * Math.cos(θ) - y2 * Math.sin(θ)));
    this.points[1][1] = Math.floor(this.pole[1] + distY + (y2 * Math.cos(θ) + x2 * Math.sin(θ)));
    this.points[2][0] = Math.floor(this.pole[0] + distX + (x3 * Math.cos(θ) - y3 * Math.sin(θ)));
    this.points[2][1] = Math.floor(this.pole[1] + distY + (y3 * Math.cos(θ) + x3 * Math.sin(θ)));
  }

  __distance() {
    const dx = this.points[0][0] - this.pole[0];
    const dy = this.points[0][1] - this.pole[1];
    return Math.floor(Math.sqrt(dx * dx + dy * dy));
  }

  __lerp(src, dst, coeff) {
    return src + (dst - src) * coeff;
  }

  __update() {
    const dist = this.__distance();
    if (dist - this.range > 0.0001)
      this.__restart();
    else {
      this.points.forEach((point, index) => (this.points[index][0] = point[0] + this.speedX, this.points[index][1] = point[1] + this.speedY));
      this.opacity = this.__lerp(1, 0, dist / this.range);
    }
  }

  render(){
    this.__update();
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = "miter";
    this.ctx.strokeStyle = `rgba(179, 179, 179, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0][0], this.points[0][1]);
    this.ctx.lineTo(this.points[1][0], this.points[1][1]);
    this.ctx.lineTo(this.points[2][0], this.points[2][1]);
    this.ctx.lineTo(this.points[0][0], this.points[0][1]);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fillStyle = `rgba(179, 179, 179, ${this.opacity / 5})`;
    this.ctx.fill();
  }
}

export class CrystalWave {
  constructor(canvas) {
    this.cvs = canvas;
    this.ctx = canvas.getContext('2d');
    this.triangleSet = [];
    this.triangleNum = 25;
    const realm = this.cvs.width / 2;
    for (let i = 0; i < this.triangleNum; ++i)
      this.triangleSet[i] = new Triangle(this.ctx, 1.5, [realm, realm], realm);
  }

  render() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.triangleSet.forEach(triangle => triangle.render());
  }

  run() {
    if (!this.timer) {
      this.timer = setInterval(this.render.bind(this), 25);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }

  getPlayState() {
    return this.timer !== 0
  }
}

export const text = '水晶音波'
