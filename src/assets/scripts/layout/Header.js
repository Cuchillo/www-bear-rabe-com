import { gsap, Power2 } from "gsap";
import Movable from "../components/Movable";
import { isSmartphone } from "../_app/cuchillo/core/Basics";
import { C, GetBy } from '../_app/cuchillo/core/Element';
import MediaObject from "../_app/cuchillo/display/MediaObject";
import { Ease } from "../_app/cuchillo/utils/Ease";

class Header__Title {
  _container;
  _domText;
  _domIcon;
  _text;
  _subtext;

  get text() { return this._text; }
  set text(__text) {
    this._text = __text;
    this._domText.innerHTML = "";
    this._text.split(" ").map(char => {
      const span = document.createElement("span");
      const mask = document.createElement("span");
      span.classList.add("masked-item");
      span.classList.add("__maskedText");
      mask.classList.add("mask");

      span.textContent = char;
      span.appendChild(mask);
      this._domText.appendChild(span);
    });
  }
  get subtext() { return this._subtext; }
  set subtext(__text) {
    this._subtext = __text;
    this._domIcon.innerHTML = "";
    this._subtext.split("").map(char => {
      const span = document.createElement("span");
      span.textContent = char;
      this._domIcon.appendChild(span);
    });
  }

  constructor(__dom) {
    this._container = __dom;
    this._domText = GetBy.class("text", this._container)[0];
    this._domIcon = GetBy.class("icon", this._container)[0];

    this.text = "";
    this.subtext = "";
  }

  show() {

  }

  hide() {

  }
}

export default class Header {
  static container = GetBy.id("Header");
  static cover;
  static nav = GetBy.class("__nav", this.container)[0];
  static mask = GetBy.class("__mask", this.container)[0];
  static title = new Header__Title(GetBy.class("__title", this.container)[0]);
  static items = [];
  static currentAni = -1;
  static currentLoad = -1;
  static currentFigure;
  static isEnabledCover = false;
  static idTimer;
  static time = 3000;

  static show(__delay = .3) {
    gsap.to(this.nav,{alpha:1, ease: Power2.easeOut, duration:.01, delay: __delay});
    gsap.to(this.mask, {scaleX: 0, duration: .4, delay:__delay + .8, ease:Ease.EASE_CUCHILLO_IN_OUT});
  }

  static hide() {
    gsap.set(this.mask, {scaleX: 1});
    gsap.to(this.nav,{alpha:0, ease: Power2.easeOut, duration:.1, delay:.3});
  }

  static addCover(__dom, __index = 0) {
    this.cover = __dom;
    this.container.appendChild(__dom);
    this.isEnabledCover = true;

    //REMOVE IMAGES
    [...GetBy.selector("figure",__dom)].map((item,index) => {
      if(index!=__index) {

        const image = GetBy.selector("img", item)[0];
        item.classList.add("--hide");
        image.removeAttribute("data-item-load");
        this.items.unshift({
          container: item,
          image: image,
          src: MediaObject.getSrc(image),
          ratio: Number(image.getAttribute("width"))/Number(image.getAttribute("height")),
          loaded: false,
        });

      } else {
        const image = GetBy.selector("img",item)[0];
        const ratio = Number(image.getAttribute("width"))/Number(image.getAttribute("height"));
        __dom.style.setProperty('--ratio', ratio);

        this.currentFigure = item;

        this.items.push({
          container: item,
          image: image,
          src: MediaObject.getSrc(image),
          ratio: Number(image.getAttribute("width"))/Number(image.getAttribute("height")),
          loaded: true,
        });
      }
    })
  }

  static showCover() {
    gsap.to(this.cover,{alpha:1, ease: Power2.easeOut, duration:.2, delay:.3});
    if(this.items.length > 1) {
      this.loadNext();
      this.initCoverAnimation();
    }
  }

  static loadNext() {
    if(!this.isEnabledCover) return;

    this.currentLoad++;

    if(this.currentLoad >= this.items.length) return;
    if(this.items[this.currentLoad].loaded) {
      this.currentLoad++;
      this.loadNext();
    } else {
      this.items[this.currentLoad].image.addEventListener('load', () => {
        this.items[this.currentLoad].loaded = true;
        this.loadNext();
      });

      this.items[this.currentLoad].image.setAttribute("src", this.items[this.currentLoad].src);
    }
  }

  static initCoverAnimation() {
    if(!this.isEnabledCover) return;
    this.idTimer = setTimeout(()=> {this.changeImage()}, this.time)
  }

  static changeImage() {
    if(!this.isEnabledCover) return;
    
    this.currentAni = this.currentAni + 1 >= this.items.length? 0 : this.currentAni + 1;

    if(this.items[this.currentAni].loaded) {
      this.currentFigure.classList.add("--hide");
      this.currentFigure = this.items[this.currentAni].container;
      this.cover.style.setProperty('--ratio', this.items[this.currentAni].ratio);
      this.currentFigure.style.opacity = 0;
      this.currentFigure.classList.remove("--hide");
      if(!isSmartphone) Movable.reset();
      this.currentFigure.style.opacity = 1;
    } else {
      this.currentAni--;
    }

    this.idTimer = setTimeout(()=> {this.changeImage()}, this.time)
  }

  static hideCover(__dom) {
    clearTimeout(this.idTimer);
    this.isEnabledCover = false;
    this.currentAni = -1;
    this.currentLoad = -1;
    this.currentFigure = null;
    this.items = [];

    if(this.cover) {
      C.remove(this.cover);
      this.cover = false;
    }
  }
}




