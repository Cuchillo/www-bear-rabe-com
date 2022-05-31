import { gsap } from "gsap";
import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import { GetBy } from '../_app/cuchillo/core/Element';
import { Functions } from '../_app/cuchillo/utils/Functions';
import { Ease } from '../_app/cuchillo/utils/Ease';
import { Basics } from "../_app/cuchillo/core/Basics";
import { Maths } from "../_app/cuchillo/utils/Maths";

export default class Home extends Page {

  _tl_Billboard;

  constructor() {
    super();

    this.setupBillboard();
  }

  setupBillboard() {
    const words = GetBy.class("billboard-item", this.container);
    const wordsIndexShow = Functions.arrayRandom([...Array(words.length).keys()]);
    const wordsIndexReveal = Functions.arrayRandom([...Array(words.length).keys()]);
    let inc = .08;
    let incS = .02;
    let cont = 0;
    let time = 0;

    this._tl_Billboard = gsap.timeline();
    this._tl_Billboard.pause();

    for(let i = 0; i<words.length; i++) {
      this._tl_Billboard.to(words[wordsIndexShow[i]], {alpha: 1, duration: .03}, time);

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
      const mask = GetBy.class("mask", words[wordsIndexShow[i]]);
      this._tl_Billboard.to(mask, {scaleX: 0, duration: .4, ease:Ease.EASE_CUCHILLO_IN_OUT}, time);

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

  //SHOW
  beforeShow() {}

  show__effect(__call) {
    Wrap.directShow();
    this._tl_Billboard.restart();
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Wrap.hide(() => {this.afterHide();});
  }

  afterHide() {
    super.afterHide();
  }

  //RESIZE
  resize() {
    super.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
    }
  }
}

ControllerPage._addPage("home", Home)
