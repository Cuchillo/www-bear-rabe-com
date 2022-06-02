import { gsap, Power2 } from "gsap";
import { GetBy } from '../_app/cuchillo/core/Element';
import { Ease } from "../_app/cuchillo/utils/Ease";

export default class Header {
  static container = GetBy.id("Header");
  static mask = GetBy.class("mask", this.container)[0];

  static show(__delay = .3) {
    gsap.to(this.container,{alpha:1, ease: Power2.easeOut, duration:.01, delay: __delay});
    gsap.to(this.mask, {scaleX: 0, duration: .4, delay:__delay + .8, ease:Ease.EASE_CUCHILLO_IN_OUT});
  }

  static hide() {
    gsap.set(this.mask, {scaleX: 1});
    gsap.to(this.container,{alpha:0, ease: Power2.easeOut, duration:.1, delay:.3});
  }
}


