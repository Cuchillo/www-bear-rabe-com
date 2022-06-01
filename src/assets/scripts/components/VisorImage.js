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
   // this._width = (__w * Sizes.RATIO);
    gsap.to(this,{_width:(__w * Sizes.RATIO), ease: Power2.easeOut, duration:.2});
  }
  get height() { return this._height; }
  set height(__h) {
   // this._height = (__h * Sizes.RATIO);
    gsap.to(this,{_height:(__h * Sizes.RATIO), ease: Power2.easeOut, duration:.2});
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
  image = new VisorImage__Image(this.ctx);
  images = []
  position = {
    x:0,
    y:0
  }
  actual = 0;
  max;
        
  constructor(__container) {
    this.container = __container;

    this.setupImages();
  }

  setupImages() {
    console.log(IMAGES_PROJECTS)
    IMAGES_PROJECTS.map(item => {
      const dom = new Image();
      dom.src = item.image;

      this.images.push({
        image: dom,
        width: item.width,
        height: item.height,
      })
    });
  }


  loop() {
    const x = Math.floor(Interaction.positions.mouse.x/Metrics.GRID);
    const y = Math.floor(Interaction.positions.mouse.y/Metrics.GRID);

    if(this.position.x != x || this.position.y != y) {
      this.max = Metrics.GRID * 7;
      const imgActual = this.images[this.actual];
      this.actual = this.actual+1 == IMAGES_PROJECTS.length? 0 : this.actual + 1;
      this.image.image = imgActual.image;

      this.image.x = (x * Metrics.GRID) + (Metrics.GRID *.5);
      this.image.y = (y * Metrics.GRID) + (Metrics.GRID *.5);

      if (imgActual.width > imgActual.height) {
        this.image.width = this.max;
        this.image.height = this.max * (imgActual.height/imgActual.width);
      } else {
        this.image.height = this.max;
        this.image.width = this.max * (imgActual.width/imgActual.height);
      }
                 
      this.position = { x:x, y:y}
    }

    this.image.loop();  
    
  }
}
