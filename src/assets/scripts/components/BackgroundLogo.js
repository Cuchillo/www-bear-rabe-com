import { GetBy } from "../_app/cuchillo/core/Element";
import { gsap, Power2 } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { Ease } from "../_app/cuchillo/utils/Ease";
import { Basics } from "../_app/cuchillo/core/Basics";
import { Maths } from "../_app/cuchillo/utils/Maths";
import { id } from "date-fns/locale";

export default class BackgroundLogo {
  static container = GetBy.id("Logos");
    
  static show(__call) {
    gsap.to(this.mainholder, {
      alpha: 1,
      duration: .2,
      ease: Power2.easeOut,
      onComplete:() => {
        if(__call) __call();
      }
    });
  }
  
  static hide(__call) {
    gsap.to(this.mainholder, {
      alpha: 0,
      duration: .2,
      ease: Power2.easeOut,
      onComplete:() => {
        if(__call) __call();
      }
    });
  }

  static setBlack() {
    this.container.classList.add("--black");
  }

  static setWhite() {
    this.container.classList.remove("--black");
  }

  static setInverted() {
    this.container.classList.add("--inv");
  }

  static setNormal() {
    this.container.classList.remove("--inv");
  }
}
