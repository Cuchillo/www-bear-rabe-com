import { Keyboard } from "../_app/cuchillo/core/Keyboard";
import { Maths } from "../_app/cuchillo/utils/Maths";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { gsap, Power2 } from "gsap";
import InterfaceCanvas from "../_app/cuchillo/layout/InterfaceCanvas";

class TopCanvas__Image {
  image = new Image();
  size = 28;
  _width;
  _height;
  _ratio;

  cont = 0;

  constructor(__src) {
    this.image.onload = () => {
      this.enabled = true;
      this._ratio = this.image.height / this.image.width;

      if(this._ratio < 1 || !this.hasMaxHeight) {
        this._width = this.size;
      } else {
        this.size = this.size * (this.image.width / this.image.height);
        this._width = this.size;
      }

      this._height = this._width * this._ratio;
    };
    this.image.src = __src;
  }

  draw (__x,__y) {
    this._ctx.globalAlpha = this.alpha;
    this._ctx.drawImage(this.image, __x, __y, this._size, this._size * this._ratio);
    this._ctx.restore();
  }
}

export default class TopCanvas {
  static canvas = InterfaceCanvas.canvas;
  static ctx = InterfaceCanvas.ctx;
  static width = window.innerWidth * window.devicePixelRatio;
  static height = window.innerHeight * window.devicePixelRatio;
  static ratioGrid = 1372/4801;
  static grid = [];
  static sizeGridH;
  static sizeGridV;
  static _cols;
  static total;
  static rows;
  static progress = 0;
  static cont=-1;
  static get cols() { return this._cols; }
  static set cols(__cols) {
    this._cols = __cols;
    this.sizeGridH = this.width/this._cols;
    this.sizeGridV = this.sizeGridH * this.ratioGrid;
    this.rows = Math.ceil(this.height/this.sizeGridV);
    this.total = this.cols * this.rows;
   
    this.setupGrid();
  }
  static isEnabled = false; 
  static _images = [
    new TopCanvas__Image("/assets/images/load-01.png"),
    new TopCanvas__Image("/assets/images/load-02.png"),
    new TopCanvas__Image("/assets/images/load-03.png")
  ] 

  static init(__container = document.body) {
    this.cols = 3;
    this.isEnabled = true;

    /*Keyboard.add("a", "a", ()=> {this.cols++});
    Keyboard.add("s", "s", ()=> {this.cols--});
    Keyboard.add("q", "q", ()=> {this.progress+=.1});
    Keyboard.add("w", "w", ()=> {this.progress-=.1});
    Keyboard.add("n", "n", ()=> {this.loop()});*/

    setInterval(()=> {this.grid = Functions.arrayRandom(this.grid);}, 1200);
    setInterval(()=> {gsap.to(this,{progress:Maths.maxminRandom(1,10)/10, duration:.3, ease:Power2.easeOut})}, 900);
    setInterval(()=> {
      gsap.to(this,{cols:Maths.maxminRandom(1,16), duration:.2, ease:Power2.easeOut})}
    , 410);
    
  }

  static setupGrid() {
    this.grid = [];
    
    for(let i=0; i<this.cols; i++) {
      for(let j=0; j<this.rows; j++) {
        this.grid.push({
          x:i,
          y:j,
        });
      }
    }

    this.grid = Functions.arrayRandom(this.grid)
  }

  static loop() {
    if(!this.isEnabled) return;
        
    
    let indexImage = 0;
    const limitProgress = Math.round(this.total * this.progress)
    
    console.log(0)



     for(let i=0; i<limitProgress; i++) {
      if((this.grid[i].x%2===0 && this.grid[i].y%2!=0) || this.grid[i].y%2===0 && this.grid[i].x%2!=0) {
        this.ctx.beginPath();
        this.ctx.rect(this.sizeGridH * this.grid[i].x, this.sizeGridV * this.grid[i].y, this.sizeGridH, this.sizeGridV);
        this.ctx.stroke();

        this.ctx.drawImage(
          this._images[indexImage].image, 
          this.sizeGridH * this.grid[i].x, 
          this.sizeGridV * this.grid[i].y, 
          this.sizeGridH, 
          this.sizeGridV);
      }
      indexImage++;
      if(indexImage === 3) indexImage = 0;
    }
  }

  static resize() {
    if(!this.isEnabled) return;

    this.width = window.innerWidth * window.devicePixelRatio;
    this.height = window.innerHeight * window.devicePixelRatio;
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
  }
}



