const PI2 = 2 * Math.PI;

class Circle {
  constructor(context, speed, pole, radius, range) {
    this.ctx = context;
    this.speed = speed;
    this.pole = pole;
    this.radius = radius;
    this.range = range;
    this.__restart();
  }

  __restart() {
    this.r = this.r ? this.radius[0] : this.radius[1];
    this.ballRadius = Math.floor(4 + Math.random() * 3);
    this.ballAngle = Math.random() * PI2;
    this.ballPoint || (this.ballPoint = [0, 0]);
    this.ballPoint[0] = Math.cos(this.ballAngle) * this.r;
    this.ballPoint[1] = Math.sin(this.ballAngle) * this.r;
  }

  __lerp(src, dst, coeff) {
    return src + (dst - src) * coeff;
  }

  __update() {
    if (this.r - this.range > 0.0001)
      this.__restart();
    else {
      this.r += this.speed;
      this.ballAngle += .01;
      this.ballPoint[0] = Math.cos(this.ballAngle) * this.r;
      this.ballPoint[1] = Math.sin(this.ballAngle) * this.r;
      this.opacity = this.__lerp(1, 0, this.r / this.range);
    }
  }

  render() {
    this.__update();
    // 绘制空心圆
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = `rgba(179, 179, 179, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.pole[0], this.pole[1], this.r, 0, PI2);
    this.ctx.stroke();
    // 绘制小球
    this.ctx.strokeStyle = `rgba(179, 179, 179, 0)`;
    this.ctx.fillStyle = `rgba(179, 179, 179, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.pole[0] + this.ballPoint[0], this.pole[1] + this.ballPoint[1], this.ballRadius, 0, PI2);
    this.ctx.stroke();
    this.ctx.fill();
  }
}

export class LonelyPlanet {
  constructor(canvas) {
    this.cvs = canvas;
    this.ctx = canvas.getContext('2d');
    const slit = this.cvs.width / 10;
    const pole = this.cvs.width / 2;
    this.circleSet = [];
    this.circleNum = Math.floor(pole / slit);
    const range = this.circleNum * slit;
    for (let i = 1; i < this.circleNum; ++i)
      this.circleSet.push(new Circle(this.ctx, 1, [pole, pole], [slit, slit * i], range));
  }

  render() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.circleSet.forEach(circle => circle.render());
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

export const text = '孤独星球'
