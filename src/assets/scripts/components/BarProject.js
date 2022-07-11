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
    const data = DataHolder.getProject(__id);
    this.domNext.setAttribute("href", data.url);
    this.domNext.setAttribute("data-cursor-image", data.images[0]);
  }

  static set prev(__id) {
    const data = DataHolder.getProject(__id);
    this.domPrev.setAttribute("href", data.url);
    this.domPrev.setAttribute("data-cursor-image", data.images[0]);
  }
  
  static show(){}
  static hide(){}
}



