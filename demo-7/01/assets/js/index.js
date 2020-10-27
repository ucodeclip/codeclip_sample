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

    //桜の初期位置
    positionX = winW/2;
    positionY = winH/2;

    sakura = new Sakura(ctx,positionX,positionY);
  }

  function render(){

    //桜の描写処理
    sakura.render();
  }
})()

//桜の描写関連はクラスに分けておく
class Sakura {
  constructor(ctx,positionX,positionY){
    this.ctx = ctx;
    this.size = 100;//桜の大きさの調整
    this.n = 5;//桜の花びらの枚数
    this.positionX = positionX;
    this.positionY = positionY;
  }

  render(){
    this.ctx.save();
    //描写位置を中央に
    this.ctx.translate(this.positionX,this.positionY);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'pink';
    this.ctx.moveTo(0,0);

    //0~2πまで x,y を描写する
    for(let i = 0; i < (Math.PI*2); i+= 0.01){
      //計算した結果
      let rv = this._calc(i);

      //距離（rv）にcosをかけてX軸の位置を計算
      let x = this.size * rv * Math.cos(i);
      //距離（rv）にsinをかけてY軸の位置を計算
      let y = this.size * rv * Math.sin(i);

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
}