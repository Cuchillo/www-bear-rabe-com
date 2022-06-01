import { GetBy } from "../_app/cuchillo/core/Element";
import { gsap } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { Ease } from "../_app/cuchillo/utils/Ease";
import { Basics } from "../_app/cuchillo/core/Basics";

export default class BillboardText {
  _tl;

  constructor(__container) {
    this.container = __container;
    this.setup();
  }

  setup() {
    const words = GetBy.class("billboard-item", this.container);
    const wordsIndexShow = Functions.arrayRandom([...Array(words.length).keys()]);
    const wordsIndexReveal = Functions.arrayRandom([...Array(words.length).keys()]);
    let inc = .1;
    let incS = .02;
    let cont = 0;
    let time = 0;

    this._tl = gsap.timeline();
    this._tl.pause();

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

    time+= .5;
    cont = 0;
    for(let i = 0; i<words.length; i++) {
      const mask = GetBy.class("mask", words[wordsIndexReveal[i]]);
      this._tl.to(mask, {scaleX: 0, duration: .4, ease:Ease.EASE_CUCHILLO_IN_OUT}, time);

      if(cont < 3) {
        cont++
        time+=incS * 2;
      } else {
        time+=inc * 1.3;
        cont = 0;
      }
    }

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

  show() {
    this._tl.restart();
  }
}
