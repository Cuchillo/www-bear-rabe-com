import * as THREE from 'three';
import { isWebpSupported } from '../_app/cuchillo/core/Basics';
import { C, GetBy } from "../_app/cuchillo/core/Element";
import { Metrics } from '../_app/cuchillo/core/Metrics';

export default class SpriteSheetGenerator {
  static canvas;
  static ctx;
  static hasSpritesheet = true;
  static cont = -1;
  static texture;
  static img;
  static call;
  static data;
  static options;
  static position = {x:0, y:0};
  static limits = {
    cols: 0,
    rows: 0
  }
  static defaults = {
    container: document.body,
    id: "SpriteSheetTexture",
    width: 4000,
    height: 4000,
    size: 200,
  }
  
  static init(__opts) {
    this.options = {
			...this.defaults,
			...__opts
		};

    if(!this.hasSpritesheet) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.id = this.options.id;
      this.options.container.appendChild(this.canvas);
      
      this.img = new Image();
      this.img.crossOrigin="anonymous";
      this.img.onload = () => {
        this.draw();
        this.nextImage();
      }
      this.img.onerror = () => {
        this.nextImage(true);
      }

      this.resize();
    }    
  }

  static start(__data, __call) {
    this.data = __data;
    this.call = __call;

    if(this.hasSpritesheet) {
      this.loadTexture();
    } else {
      this.nextImage();
    }
    
  }

  static nextImage(__isError) {
    if(!__isError) this.cont++;

    if(this.cont < this.data.length) {
      const webp = isWebpSupported && !__isError? ".webp" : "";
      this.img.src = this.data[this.cont].thumb + webp;
    } else {
      this.end();
    }
  }
  
  static draw() {
    this.position = {
      x: (this.cont%this.limits.x) * this.options.size,
      y: Math.floor(this.cont/this.limits.x) * this.options.size
    }

    this.ctx.filter = 'contrast(1.1) saturate(131%)';
    this.ctx.drawImage(this.img, 
      this.position.x,
      this.position.y,
      this.options.size,
      this.options.size,
    );
  }

  static drawSquare(__color, __isBG = false) {
    this.position = {
      x: (this.cont%this.limits.x) * this.options.size,
      y: Math.floor(this.cont/this.limits.x) * this.options.size
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = __color;

    if(__isBG) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      this.ctx.fillRect(
        0,
        0,
        4000,
        4000,
      );
    } else {
      this.ctx.fillRect(
        this.position.x,
        this.position.y,
        this.options.size,
        this.options.size,
      );

      this.cont++;
    }
  }

  static end() {
    this.drawSquare("#0000FF");
    this.drawSquare("#00FF00");
    this.drawSquare("#959595");   

    if(!this.hasSpritesheet) {
      this.saveImage();
    }

    this.texture = new THREE.TextureLoader().load(this.canvas.toDataURL(), ()=> {
      this.call();
    });    
  }

  static saveImage(__name = "spritesheet") {
    try {
        const strMime = "image/jpeg";
        const strMimeDown = "image/octet-stream";
        const imgData = this.canvas.toDataURL(strMime);
        this._saveFile(imgData.replace(strMime, strMimeDown), __name + ".jpg");
      } catch (e) {
          console.log(e);
          return;
      }
  }

  static _saveFile (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
  }

  static loadTexture() {
    const url = GetBy.id("__spritesheet").getAttribute("href");
    const spritesheet = !isWebpSupported? url.replace(".webp", "") : url;
    
    this.texture = new THREE.TextureLoader().load(spritesheet, ()=> {
      this.call();
    });    
  }

  static dispose() {
    if(this.canvas) C.remove(this.canvas);

    this.ctx = null;
    this.cont = null;
    this.img = null;
    this.data = null;
    this.options = null;
    this.position = null;
    this.limits = null;
    this.defaults = null;
    this.call = null;
  }

  static resize() {
    this.limits.x = Math.floor(this.options.width/this.options.size);
    this.limits.y = Math.floor(this.options.height/this.options.size);
    this.canvas.setAttribute("width", this.options.width);
    this.canvas.setAttribute("height", this.options.height);
  }
}