import { gsap, Power2 } from "gsap";
import { GetBy } from '../_app/cuchillo/core/Element';
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
  static nav = GetBy.class("__nav", this.container)[0];
  static mask = GetBy.class("__mask", this.container)[0];
  static title = new Header__Title(GetBy.class("__title", this.container)[0]);
  
  static show(__delay = .3) {
    gsap.to(this.nav,{alpha:1, ease: Power2.easeOut, duration:.01, delay: __delay});
    gsap.to(this.mask, {scaleX: 0, duration: .4, delay:__delay + .8, ease:Ease.EASE_CUCHILLO_IN_OUT});
  }

  static hide() {
    gsap.set(this.mask, {scaleX: 1});
    gsap.to(this.nav,{alpha:0, ease: Power2.easeOut, duration:.1, delay:.3});
  }
}




