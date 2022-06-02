import { GetBy } from "../_app/cuchillo/core/Element";
import { gsap, Power2 } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { Ease } from "../_app/cuchillo/utils/Ease";
import { Basics } from "../_app/cuchillo/core/Basics";
import { Interaction } from "../_app/cuchillo/core/Interaction";
import { Maths } from "../_app/cuchillo/utils/Maths";
import InterfaceCanvas from "../_app/cuchillo/layout/InterfaceCanvas";
import { Metrics } from "../_app/cuchillo/core/Metrics";
import { Sizes } from "../_app/cuchillo/core/Sizes";

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
    this.ctx.drawImage(this.image, this.x - this.width * .5, this.y - this.height * .5, this.width, this.height);
    this.ctx.fill();
  }
}

export default class VisorImage {
  canvas = InterfaceCanvas.canvas;
  ctx = InterfaceCanvas.ctx;
  visor = new VisorImage__Image(this.ctx);
  images = []
  position = {
    x:0,
    y:0
  }
  limits = {
    y0:0,
    y1:0
  }

  actual = 0;
  maxSize;
        
  constructor(__container) {
    this.container = __container;
    this.setupSize();
    this.setupImages();
  }

  setupSize() {
    const rect = this.container.getBoundingClientRect();
    this.limits = {
      y0:rect.top,
      y1:rect.bottom,
    }
  }

  setupImages() {
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


  loop() {
    if(Interaction.positions.mouse.y<this.limits.y0 || Interaction.positions.mouse.y>this.limits.y1) return;

    const x = Math.floor(Interaction.positions.mouse.x/Metrics.GRID);
    const y = Math.floor(Interaction.positions.mouse.y/Metrics.GRID);

    if(this.position.x != x || this.position.y != y) {
      this.changeImage();
      this.visor.x = (x * Metrics.GRID) + (Metrics.GRID *.5);
      this.visor.y = (y * Metrics.GRID) + (Metrics.GRID *.5);           
      this.position = { x:x, y:y}
    }

    this.visor.loop();   
  }

  changeImage() {
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

  resize() {
    this.maxSize = Metrics.GRID * 7;
    this.setupSize();
  }
}
