(function(){
  //必要な変数の宣言
  let canvas,ctx,positionX,positionY,sakura;
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  window.addEventListener('DOMContentLoaded',function(){
    //初期設定
    init();

    //桜の描写
    render();
  })

  function init(){
    //canvasを用意
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = winW;
    canvas.height = winH;

    sakura = new Sakura(ctx,winH,winW);
  }

  function render(){
    //canvasのリセット
    ctx.clearRect(0, 0, winW, winH);

    //canvasの背景色
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, winW, winH);

    //桜の描写処理
    sakura.update();
    sakura.render();
    requestAnimationFrame(render)
  }
})()

//桜の描写関連はクラスに分けておく
class Sakura {
  constructor(ctx,winH,winW){
    this.ctx = ctx;
    this.winH = winH;
    this.winW = winW;
    this.positionX = this._random(0,winW);
    this.positionY = this._random(0,winH);
    this.positionStartX = this.positionX;
    this.positionRangeX = this._random(50,100);//x軸方法の幅
    this.positionRangeAddX = this._random(0,Math.PI*2);
    this.size = this._random(30,60);//桜の大きさの調整
    this.n = 5;//花びらの枚数
    this.scaleY = this._random(0,Math.PI*2);//花びらのY軸の大きさ
    this.scaleAddY = 0.02;
    this.rorate = this._random(0,Math.PI*2);//初期の回転角度
  }

  update(){
    //花びらの大きさによって落ちるスピードを変える
    this.positionY += this.size / 30;
    if(this.positionY > this.winH + this.size){
      this.positionY = -this.size;
    }

    //x軸方向に動かす
    this.positionRangeAddX += 0.05;
    this.positionX = this.positionStartX + Math.sin(this.positionRangeAddX)*this.positionRangeX;

    this.scaleY += this.scaleAddY;
  }

  render(){
    this.ctx.save();
    this.ctx.translate(this.positionX,this.positionY);
    //sinを使って回転させる
    this.ctx.rotate(Math.sin(this.positionY * Math.PI/180) + this.rorate);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'pink';
    this.ctx.moveTo(0,0);

    //0~2πまで x,y を描写する
    //ループの範囲をthis.nで割ると桜の花びら一枚分の描写になる
    for(let i = 0; i < (Math.PI*2 / this.n); i+= 0.01){
      //計算した結果
      let rv = this._calc(i);

      //距離（rv）にcosをかけてX軸の位置を計算
      let x = this.size * rv * Math.cos(i);
      //距離（rv）にsinをかけてY軸の位置を計算
      //Math.cos(this.scaleY)でY軸の大きさを0~1にする（回転しているように見える）
      let y = this.size * Math.cos(this.scaleY) * rv * Math.sin(i);

      this.ctx.lineTo(x, y);
    }

    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore()
  }

  _calc(x){
    //桜の花びらの枚数
    const ulim = 0.8;
    const h = (x) => {
      if(x < ulim){
        return 0
      }else {
        return ulim - x;
      }
    }
    const r0 = (x) => {
      //this.nは桜の枚数
      const V = this.n/Math.PI*x;
      const mod = (a,b) =>{
        return a % b;
      };
      const floor = (a) => {
        return Math.floor(a);
      };
      return Math.pow(-1,mod(floor(V),2))*(V-floor(V))+mod(floor(V),2);
    }
    const r = (x) => {
      return r0(x) + 2*h(r0(x))
    }
    return r(x)
  }

  _random(min, max){
    return (Math.floor(Math.random()*(max + 1 - min)) + min);
  }
}