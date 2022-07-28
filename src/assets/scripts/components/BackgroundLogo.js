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
    gsap.to(this.container, {
      alpha: 1,
      duration: .2,
      ease: Power2.easeOut,
      onComplete:() => {
        if(__call) __call();
      }
    });
  }
  
  static hide(__call) {
    gsap.to(this.container, {
      alpha: 0,
      duration: .2,
      ease: Power2.easeOut,
      onComplete:() => {
        if(__call) __call();
      }
    });
  }

  static setWhite() {
    this.container.classList.add("--white");
  }

  static setBlack() {
    this.container.classList.remove("--white");
  }

  static setInverted() {
    this.container.classList.remove("--rabe");
    this.container.classList.add("--inv");
  }

  static setNormal() {
    this.container.classList.remove("--rabe");
    this.container.classList.remove("--inv");
  }

  static setRabe() {
    this.container.classList.add("--rabe");
    this.container.classList.remove("--inv");
  }
}
