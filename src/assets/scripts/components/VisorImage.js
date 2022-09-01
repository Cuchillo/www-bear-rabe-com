import { gsap, Power2 } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { isSmartphone, isWebpSupported } from "../_app/cuchillo/core/Basics";
import { Interaction } from "../_app/cuchillo/core/Interaction";
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
    if(isSmartphone) {
      this.ctx.drawImage(this.image, this.x - this.width * .5, this.y - this.height * 1.1, this.width, this.height);
    } else {
      this.ctx.drawImage(this.image, this.x - this.width * .5, this.y - this.height * .5, this.width, this.height);
    }
    
    this.ctx.fill();
  }
}

export default class VisorImage {
  canvas = InterfaceCanvas.canvas;
  ctx = InterfaceCanvas.ctx;
  visor = new VisorImage__Image(this.ctx);
  images = [];
  projects = [];
  isEnabled = false;
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
    PROJECTS.map(item => {
      const images = [];

      item.images.map(item => {
        const dom = new Image();

        this.images.push({
          order: images.length,
          load: () => {dom.src = isWebpSupported? item.image + ".webp" : item.image;}
        });
  
        images.push({
          index: images.length,
          image: dom,
          project: item.project,
          width: item.width,
          height: item.height,
        })
      });
      
      this.projects.push({
        id: item.project_id,
        images: images,
        url: item.url,
        actual: 0,
        total: images.length,
      })
    });

    this.images.sort((a, b) => a.order - b.order);
    this.images.map(item => item.load());
  }


  loop() {
    if(!this.isEnabled) return;
    
    if(Interaction.positions.mouse.y<this.limits.y0 || Interaction.positions.mouse.y>this.limits.y1) return;
    
    const x = Math.floor(Interaction.positions.mouse.x/Metrics.GRID);
    const y = Math.floor(Interaction.positions.mouse.y/Metrics.GRID);

    if(this.position.x != x || this.position.y != y) {
      this.changeImage();
      this.visor.x = (x * Metrics.GRID) + (Metrics.GRID *.5);
      this.visor.y = (y * Metrics.GRID) + (Metrics.GRID *.5);           
      this.position = isSmartphone? { x:Metrics.CENTER_X, y:Metrics.CENTER_Y} : { x:x, y:y}
    }

    this.visor.loop();   
  }

  changeImage() {
    const project = this.projects[this.actual];
    const img = project.images[project.actual];
    project.actual = project.actual + 1 === project.total? 0 : project.actual + 1;
  
    this.visor.image = img.image;

    if (img.width > img.height) {
      this.visor.width = this.maxSize;
      this.visor.height = this.maxSize * (img.height/img.width);
    } else {
      this.visor.height = this.maxSize;
      this.visor.width = this.maxSize * (img.width/img.height);
    }

    if(this.actual+1 == this.projects.length) {
      this.actual = 0;
      Functions.arrayRandom(this.projects);
    } else {
      this.actual++;
    }

    //link
    this.container.setAttribute("href", project.url);
    this.container.setAttribute("data-temp-value", `${project.id},${img.index}`);
  }

  resize() {
    this.maxSize = isSmartphone? Metrics.GRID * 35 : Metrics.GRID * 10;
    this.setupSize();
  }
}
