import { Metrics } from "../_app/cuchillo/core/Metrics";
import { Maths } from "../_app/cuchillo/utils/Maths";

export default class Movable {
  static items = [];

  container;
  _isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  _events = {};
  _offset = {x:0,y:0,z:1};
  _position = {
    x: 0,
    y: 0,
    z: 0,
    rx:0,
    ry:0
  };
  _isDOwn = false;

  static start() {
    [...document.querySelectorAll(".__movable")].map(item => {
      this.items.push(new Movable(item));
    });
  }

  static end() {
    //this.items.map(item => { item.dispose(); });
  }

  constructor(__item) {
    this.container = __item;

    window.zIndex = 100;
    
    this.setupOptions();
    this.setupEvents();
    this.setupPosition();
  }

  setupPosition() {
    const xMod = this.container.offsetWidth;
    const yMod = this.container.offsetHeight;
    
    this._position.x = Maths.maxminRandom(Metrics.WIDTH - xMod * .75, -xMod * .25);
    this._position.y = Maths.maxminRandom(Metrics.HEIGHT - yMod * .75, Metrics.GRID * 4);
    this._position.z = 10;

    this.container.style.transform = `translate3d(${this._position.x}px, ${this._position.y}px, ${this._position.z}px)`;
  }

  setupEvents() {
    this.container.addEventListener(this._events.downEvent, (e) => {
        this._isDown = true;  

        this._offset = {
          x: this._isTouch? e.touches[0].screenX : e.clientX,
          y: this._isTouch? e.touches[0].screenY : e.clientY,
          z: this.nextDepth()
        };
  
        }, true);

    document.addEventListener(this._events.upEvent, (e) => {
        this._isDown = false;  
    }, true);

    document.addEventListener(this._events.moveEvent, (e) => {
        if(!this._isDown) return;

        const pos = {
            x: this._isTouch? e.touches[0].screenX : e.clientX,
            y: this._isTouch? e.touches[0].screenY : e.clientY,            
            z: this._offset.z
        };

        this._position.x += pos.x - this._offset.x;
        this._position.y += pos.y - this._offset.y;
        this._position.z = pos.z;

        this._offset = {
            x:pos.x,
            y:pos.y,
            z:pos.z,
          };

        this.container.style.transform = `translate3d(${this._position.x}px, ${this._position.y}px, ${this._position.z}px)`;
    }, true);
  }

  setupOptions() {
    if (!this._isTouch) {
        this._events.clickEvent = "click";
        this._events.downEvent = "mousedown";
        this._events.upEvent = "mouseup";
        this._events.moveEvent = "mousemove";
        this._events.mouseOver = "mouseover";
        this._events.mouseOut = "mouseout";
      } else {
        this._events.clickEvent = "click";
        this._events.downEvent = "touchstart";
        this._events.upEvent = "touchend";
        this._events.moveEvent = "touchmove";
        this._events.mouseOver = "touchstart";
        this._events.mouseOut = "touchend";
      }
  }

  nextDepth() {
    window.zIndex++;
    return window.zIndex;
  }
}