import { Keyboard } from "../_app/cuchillo/core/Keyboard";
import { Maths } from "../_app/cuchillo/utils/Maths";
import { gsap, Power2 } from "gsap";

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
  static canvas = document.createElement('canvas');
  static ctx = this.canvas.getContext('2d');
  static width = window.innerWidth * window.devicePixelRatio;
  static height = window.innerHeight * window.devicePixelRatio;
  static ratioGrid = 1372/4801;
  static grid = [];
  static sizeGridH;
  static sizeGridV;
  static _cols;
  static total;
  static rows;
  static progress = 1;
  static cont=-1;
  static get cols() { return this._cols; }
  static set cols(__cols) {
    this._cols = __cols;
    this.sizeGridH = this.width/this._cols;
    this.sizeGridV = this.sizeGridH * this.ratioGrid;
    this.rows = Math.ceil(this.height/this.sizeGridV);
    this.total = this.cols * this.rows;
   
    console.log(this.cols,this.rows,this.total)

    this.setupGrid();
  }
  static isEnabled = true; 
  static _images = [
    new TopCanvas__Image("/assets/images/load-01.png"),
    new TopCanvas__Image("/assets/images/load-02.png"),
    new TopCanvas__Image("/assets/images/load-03.png")
  ] 

  static init(__container = document.body) {
    __container.appendChild(this.canvas);
    this.canvas.style.position = "fixed";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "99999";
    this.canvas.style.pointerEvents = "none";
    this.cols = 4;

    Keyboard.add("a", "a", ()=> {this.cols++});
    Keyboard.add("s", "s", ()=> {this.cols--});
    Keyboard.add("q", "q", ()=> {this.progress+=.1});
    Keyboard.add("w", "w", ()=> {this.progress-=.1});
    Keyboard.add("n", "n", ()=> {this.loop()});

    setInterval(()=> {gsap.to(this,{progress:Maths.maxminRandom(1,10)/10, duration:.3, ease:Power2.easeOut})}, 400);
    setInterval(()=> {
      gsap.to(this,{cols:Maths.maxminRandom(1,16), duration:.2, ease:Power2.easeOut})}
    , 410);
    
  }

  static setupGrid() {
    this.grid = [];
    let limit = 1;

    this.grid.push({
      x:0,
      y:0
    });
    
    while(this.grid.length < this.total) {
      let x = limit;
      let y = 0;
      for(let i=0; i<=limit; i++) {
        
        if(x<this.cols && y<this.rows) {
          if(this.grid.find(e => e.x == x && e.y == y)) {
           
          }
    
          this.grid.push({
            x:x,
            y:y
          });
        } else {
         
        }
        x--;
        y = Math.min(this.rows, y+1);
      }

      limit++;
    }
  }

  static loop() {
    if(!this.isEnabled) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    
    const limitProgress = Math.round(this.total * this.progress)
    
    for(let i=0; i<limitProgress; i++) {
      if((this.grid[i].x%2===0 && this.grid[i].y%2!=0) || this.grid[i].y%2===0 && this.grid[i].x%2!=0) {
      this.ctx.drawImage(
        this._images[0].image, 
        this.sizeGridH * this.grid[i].x, 
        this.sizeGridV * this.grid[i].y, 
        this.sizeGridH, 
        this.sizeGridV);
      }
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



