import { gsap, Power2 } from "gsap";
import { isSmartphone } from "../_app/cuchillo/core/Basics";
import { Interaction } from "../_app/cuchillo/core/Interaction";
import InterfaceCanvas from "../_app/cuchillo/layout/InterfaceCanvas";
import { Metrics } from "../_app/cuchillo/core/Metrics";
import { Sizes } from "../_app/cuchillo/core/Sizes";
import { Maths } from "../_app/cuchillo/utils/Maths";

class VisorImage__Image {
  _width = 0;
  _height = 0;
  _x = 0;
  _y = 0;
  ctx;
  image;

  get x() { return this._x; }
  set x(__x) {
    this._x = (__x * Sizes.RATIO);
  }
  get y() { return this._y; }
  set y(__y) {
    this._y = (__y * Sizes.RATIO);
  }
  get width() { return this._width; }
  set width(__w) {
    gsap.to(this,{_width:(__w * Sizes.RATIO), ease: Power2.easeOut, duration:.2, delay:.01});
  }
  get height() { return this._height; }
  set height(__h) {
    gsap.to(this,{_height:(__h * Sizes.RATIO), ease: Power2.easeOut, duration:.2, delay:.01});
  }

  constructor(__ctx) {
    this.ctx = __ctx 
  }

  loop() {
    if(!this.image) return; 
    
    this.ctx.beginPath();
    if(isSmartphone) {
      this.ctx.drawImage(this.image, this.x - this.width * .5, this.y - this.height * 1.1, this.width, this.height);
    } else {
      this.ctx.drawImage(this.image, this.x - this.width * .5, this.y - this.height * .5, this.width, this.height);
    }
    
    this.ctx.fill();
  }
}

export default class VisorImage {
  static canvas = InterfaceCanvas.canvas;
  static ctx = InterfaceCanvas.ctx;
  static visor = new VisorImage__Image(this.ctx);
  static mode = "home";
  static images = [];
  static positionTo = {
    x:0,
    y:0
  }
  static position = {
    x:0,
    y:0
  }
  static limits = {
    y0:0,
    y1:0
  }
  static actual = 0;
  static maxSize;
        
  static init(__container) {
    this.container = __container;
    this.setupSize();
    this.setupImages();
  }

  static showImage(__id) {
    for(let i=0; i<this.images.length; i++) {
      if(this.images[i].project === __id) {
        this.actual = i;
        break;
      }
    }
    this.mode = "project";

    //RANDOM
    const x = Maths.maxminRandom(Metrics.WIDTH*.9, Metrics.WIDTH*.1);
    const y = Maths.maxminRandom(Metrics.HEIGHT*.9, Metrics.HEIGHT*.1);
    
    gsap.to(this.positionTo,{x:x, duration:1, ease: Power2.easeInOut});  
    gsap.to(this.positionTo,{y:y, duration:1, ease: Power2.easeInOut});  

    this.changeImage();
  }

  static setupSize() {
    const rect = this.container.getBoundingClientRect();
    this.limits = {
      y0:rect.top,
      y1:rect.bottom,
    }
  }

  static setupImages() {
    IMAGES_PROJECTS.map(item => {
      const dom = new Image();
      dom.src = item.image;

      this.images.push({
        image: dom,
        project: item.project,
        width: item.width,
        height: item.height,
      })
    });
  }

  static loopHome() {
    if(Interaction.positions.mouse.y<this.limits.y0 || Interaction.positions.mouse.y>this.limits.y1) return false;

    this.positionTo = {
      x: Interaction.positions.mouse.x,
      y: Interaction.positions.mouse.y
    }
    
    return true;
  }

  static loop() {
    if(this.mode === "home") {
      if(!this.loopHome()) return;
    }

    const x = Math.floor(this.positionTo.x/Metrics.GRID);
    const y = Math.floor(this.positionTo.y/Metrics.GRID);
    
    if(this.position.x != x || this.position.y != y) {
      if(this.mode === "home") {
        this.changeImage();
      }
      this.visor.x = (x * Metrics.GRID) + (Metrics.GRID *.5);
      this.visor.y = (y * Metrics.GRID) + (Metrics.GRID *.5);           
      this.position = { x:x, y:y}
    }

    this.visor.loop();   
  }

  static changeImage() {
    const img = this.images[this.actual];
  
    this.visor.image = img.image;

    if (img.width > img.height) {
      this.visor.width = this.maxSize;
      this.visor.height = this.maxSize * (img.height/img.width);
    } else {
      this.visor.height = this.maxSize;
      this.visor.width = this.maxSize * (img.width/img.height);
    }

    this.actual = this.actual+1 == IMAGES_PROJECTS.length? 0 : this.actual + 1;

    //link
    this.container.setAttribute("href", PROJECTS[img.project].url);
  }

  static resize() {
    this.maxSize = isSmartphone? Metrics.GRID * 15 : Metrics.GRID * 15;
    this.setupSize();
  }
}
