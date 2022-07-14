import { Keyboard } from "../_app/cuchillo/core/Keyboard";
import { Maths } from "../_app/cuchillo/utils/Maths";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { gsap, Power2, Power1 } from "gsap";
import InterfaceCanvas from "../_app/cuchillo/layout/InterfaceCanvas";
import { GetBy } from "../_app/cuchillo/core/Element";
import { DataHolder } from "../DataHolder";

export default class BarProject {
  static container = GetBy.id("ProjectsBar");
  static domNext = GetBy.class("__next", this.container)[0];
  static domPrev = GetBy.class("__prev", this.container)[0];
  
  static set next(__id) {
    this.setData(this.domNext, __id);
  }

  static set prev(__id) {
    this.setData(this.domPrev, __id);
  }

  static setData(__dom, __id) {
    const data = DataHolder.getProject(__id);
    __dom.setAttribute("data-temp-value", __id);
    __dom.setAttribute("href", data.url);
    __dom.setAttribute("data-cursor-image", data.images[0]);
  }
  
  static show(){
    gsap.to(this.container,{autoAlpha:1, duration: .2, ease: Power2.easeIn});
  }
  static hide(){
    gsap.to(this.container,{autoAlpha:0, duration: .2, ease: Power2.easeIn});
  }
  static directHide(){
    gsap.set(this.container,{autoAlpha:0});
  }
}



