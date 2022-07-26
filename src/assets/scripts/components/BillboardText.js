import { GetBy } from "../_app/cuchillo/core/Element";
import { gsap } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { Ease } from "../_app/cuchillo/utils/Ease";
import { Basics } from "../_app/cuchillo/core/Basics";
import { Maths } from "../_app/cuchillo/utils/Maths";

export default class BillboardText {
  _tl;
  _tlHide;
  _callback;

  constructor(__container) {
    this.container = __container;
    this.setup();
    this.setupLinks();
  }

  setup() {
    const words = GetBy.class("billboard-item");
    const wordsIndexShow = Functions.arrayRandom([...Array(words.length).keys()]);
    const wordsIndexReveal = Functions.arrayRandom([...Array(words.length).keys()]);
    let inc = .06;
    let incS = .02;
    let cont = 0;
    let time = 0;
    let timeHide = 0;

    this._tl = gsap.timeline();
    this._tlHide = gsap.timeline();
    this._tl.pause();
    this._tlHide.pause();

    for(let i = 0; i<words.length; i++) {
      this._tl.to(words[wordsIndexShow[i]], {alpha: 1, duration: .03}, time);

      if(cont < 3) {
        cont++
        time+=incS;
      } else {
        time+=inc;
        cont = 0;
      }
    }

    this._tl.call(()=> {if(this._callback)this._callback()}, [], time + .1);

    time+= .5;
    cont = 0;
    for(let i = 0; i<words.length; i++) {
      const mask = GetBy.class("mask", words[wordsIndexReveal[i]]);
      this._tl.to(mask, {scaleX: 0, duration: .4, ease:Ease.EASE_CUCHILLO_IN_OUT}, time);
      this._tlHide.to(mask, {scaleX: 1, duration: 0}, timeHide);
      this._tlHide.to(words[wordsIndexShow[i]], {alpha: 0, duration:.1}, timeHide + .3);

      if(cont < 3) {
        cont++
        time+=incS;
        timeHide+=incS;
      } else {
        time+=inc * 1.3;
        timeHide+=.06;
        cont = 0;
      }
    }
  }

  setupLinks() {
    [...GetBy.class("__link", this.container)].map(item => {
      item.addEventListener(Basics.mouseOver, (e)=> {
        const scale = `${Maths.maxminRandom(15, 50)/10}`;
        const position = `${Maths.maxminRandom(100, -100)}%`;
        const origin = `${Maths.maxminRandom(20, -10)}%`;

        item.style.setProperty('--hover-scale', scale);
        item.style.setProperty('--hover-left', position);
        item.style.setProperty('--transform-origin', origin);
      });
    });
  }

  show(__call) {
    this._callback = __call;
    this._tl.restart();
  }

  hide() {
    this._tlHide.restart();    
  }

  dispose() {
    this._tl.kill();
    this._tlHide.kill();
    this._tl = null;
    this._tlHide = null;
  }
}
