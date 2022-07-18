import * as THREE from 'three';
import { C } from "../_app/cuchillo/core/Element";

export default class SpriteSheetGenerator {
  static canvas = document.createElement('canvas');
  static ctx = this.canvas.getContext('2d');
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
    width: 2000,
    height: 2000,
    size: 200,
  }
  
  static init(__opts) {
    this.options = {
			...this.defaults,
			...__opts
		};

    this.canvas.id = this.options.id;
    this.options.container.appendChild(this.canvas);
    this.img = new Image();
    this.img.crossOrigin="anonymous";
    this.img.onload = () => {
      this.draw();
      this.nextImage();
    }

    this.resize();
  }

  static start(__data, __call) {
    this.data = __data;
    this.call = __call;
    this.nextImage();
  }

  static nextImage() {
    this.cont++;

    if(this.cont < this.data.length) {
      this.img.src = this.data[this.cont].thumb;
    } else {
      this.end();
    }
  }

  static draw() {
    this.position = {
      x: (this.cont%this.limits.x) * this.options.size,
      y: Math.floor(this.cont/this.limits.x) * this.options.size
    }

    this.ctx.drawImage(this.img, 
      this.position.x,
      this.position.y,
      this.options.size,
      this.options.size,
    );
  }

  static end() {
    this.texture = new THREE.TextureLoader().load(this.canvas.toDataURL(), ()=> {
      setTimeout(()=> {this.dispose()},500);
      if(this.call) {
        this.call();
        this.call = null;
      }
    });    
  }

  static dispose() {
    C.remove(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.cont = null;
    this.texture = null;
    this.img = null;
    this.data = null;
    this.options = null;
    this.position = null;
    this.limits = null;
    this.defaults = null;
  }

  static resize() {
    this.limits.x = Math.floor(this.options.width/this.options.size);
    this.limits.y = Math.floor(this.options.height/this.options.size);
    this.canvas.setAttribute("width", this.options.width);
    this.canvas.setAttribute("height", this.options.height);
  }
}