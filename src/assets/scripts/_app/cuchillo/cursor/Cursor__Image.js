import Cursor__Item from './Cursor__Item';
import { gsap, Power4 } from 'gsap';

export default class Cursor__Image extends Cursor__Item{
  image = new Image();
  enabled = false;
  _width;
  _height;
  _ratio;
  _frame = 0;

  get x() { return this._x; }
  set x(__x) {
    if(this._frame%1===0) {
    this._xabs = __x - this._sizeabs *.5;
    this._x = this._xabs * window.devicePixelRatio;
    }
  }

  get y() { return this._y; }
  set y(__y) {
    if(this._frame%1===0) {
    this._yabs = __y - this._height *.5;
    this._y = this._yabs * window.devicePixelRatio;
    }
  }

  constructor(__src, __size, __ctx) {
    super(__size, __ctx);
    this.image.onload = () => {
      this.enabled = true;
      this._ratio = this.image.height/this.image.width;
      this._height = this._width * this._ratio
    };
    this.image.src = __src;
    this._width = this.size;
  }

  show() {
    this.size = this._width * 1;
    gsap.to(this,{duration:.5, size:this._width, ease:Power4.easeOut});
  }

  draw() {
    this._frame++;
    
    if(this.enabled) {
      this._ctx.globalAlpha = this.alpha;
      this._ctx.drawImage(this.image, this._x, this._y, this._size, this._size * this._ratio);
      this._ctx.restore();
    }
  }
}
