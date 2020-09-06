class Canvas2DUtility {
  constructor(canvas){
    this.canvasElment = canvas;
    this.context2d = canvas.getContext('2d');
  }
  get canvas(){return this.canvasElment}
  get context(){return this.context2d}

  drawRect(x, y, width, height, color){
    // 色が指定されている場合はスタイルを設定する
    if(color != null){
        this.context2d.fillStyle = color;
    }
    this.context2d.fillRect(x, y, width, height);
  }
}

class Sakura {
  constructor(ctx, canvasW, canvasH){
    this.ctx = ctx;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    //桜の枚数
    this.n  = 5;
    //桜の大きさ
    this.size = this._random(30,50);
    //桜の位置
    this.xBase = this._random(0,this.canvasW);
    this.x = this._random(0,this.xBase);
    this.y = this._random(0,this.canvasH);
    this.xRadius = this._random(50,100);

    this.xTheta = this._random(0,360);
    this.xaVelocity = this._random(1,2);
    this.yVelociry = this.size / 30;
    this.ySizeTheta = this._random(0,360);
    this.ySizeVelociry = this.size / 20;
    this.yScale = 1;
  }

  update(){
    //桜を横に揺らす
    this.x = this.xBase + this.xRadius * Math.sin(this.xTheta * Math.PI / 180);
    this.xTheta += this.xaVelocity;

    //桜を上から落とす
    this.y += this.yVelociry;
    if(this.y > canvas.height + this.size){
      this.y = -this.size;
    }

    //桜の縦幅の大きさを変える（回転しているように見せる）
    this.yScale = Math.abs(Math.sin(this.ySizeTheta * Math.PI / 180));
    this.ySizeTheta += this.ySizeVelociry;
  }

  render(){
    const TWO_PI = 2 * Math.PI;
    this.ctx.save();
    this.ctx.translate(this.x,this.y);
    this.ctx.rotate(Math.sin(this.xTheta * Math.PI/ 180) + this.xBase);
    this.ctx.beginPath();
    this.ctx.moveTo(0,0);
    for(let angle = 0; angle < (TWO_PI / this.n); angle+= 0.01){
      let r0 = this._calcr0(angle);
      let r = r0 + 2 * this._calcH(r0);
      let x = this.size * r * Math.cos(angle);
      let y = this.size * this.yScale * r * Math.sin(angle);
      this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = 'pink';
    this.ctx.fill();
    this.ctx.restore()
  }

  _calcr0(x){
    let A = this.n / Math.PI * x;
    let mod = Math.floor(A) % 2;
    return Math.pow(-1,mod)*(A - Math.floor(A)) + mod;
  }

  _calcH(x){
    if(x < 0.8){
      return 0;
    }else {
      return 0.8 - x;
    }
  }

  _random(min, max){
    return (Math.floor(Math.random()*(max + 1 - min)) + min);
  }
}

(function(){
  let util,canvas,ctx;
  let winW = $(window).innerWidth();
  let winH = $(window).innerHeight();
  let radian = 0;
  let theta = 0;
  let sakuras = [];
  let num = 50;

  $(window).on('load', function(){
    init();
    render();
  })

  function init(){
    util = new Canvas2DUtility($('#canvas')[0])
    canvas = util.canvas;
    canvas.width  = winW;
    canvas.height = winH;
    ctx = util.context2d;
    for(let i = 0; i < num; i++){
      sakuras.push(new Sakura(ctx, canvas.width, canvas.height));
    }
  }

  function render(){
    ctx.globalAlpha = 1;
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
    theta++;
    radian = theta * Math.PI / 180;
    sakuras.forEach(sakura => {
      sakura.update();
      sakura.render();
    });
    requestAnimationFrame(render)
  }
})();