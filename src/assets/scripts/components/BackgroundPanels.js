import { GetBy } from "../_app/cuchillo/core/Element";
import { gsap } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { Ease } from "../_app/cuchillo/utils/Ease";
import { Basics } from "../_app/cuchillo/core/Basics";
import { Maths } from "../_app/cuchillo/utils/Maths";

export default class BackgroundPanels {
  static limit = 10;
  static panels = [...GetBy.selector("[data-bg-panel]")];
  static colors = ["--blue", "--green", "--grey"];
  static positionsH = ["left","right","center"];
  static positionsV = ["top","bottom","center"];
  static _cont;
  
  static show() {
    this._cont = 0;
    this.colors = Functions.arrayRandom(this.colors);
    this.positionsH = Functions.arrayRandom(this.positionsH);
    this.positionsV = Functions.arrayRandom(this.positionsV);
    this.showPanel(this.panels[0], 0);
    this.showPanel(this.panels[1], 1);
  }

  static loop() {
    this._cont++;
    

    if(this._cont != this.limit) {
      setTimeout(()=> {
        this.loop();
      }, 200 - (20 * this._cont));
    }
  }

  static showPanel(__panel, __index) {
    __panel.removeAttribute("class");
    __panel.classList.add(this.colors[__index]);

    const v1 = this.getVal(10);
    const v2 = this.getVal(v1==1? 0 : 10);
    console.log(v1,v2)
    const position = Functions.arrayRandom([v1,v2]);

    gsap.set(__panel,{scaleX:position[0], scaleY:position[1], transformOrigin:`${this.positionsV[__index]} ${this.positionsH[__index]}`});
  }

  static getVal(__n100 = 0) {
    const mod = Maths.maxminRandom(__n100, 0) > 5? 10 : 0;
    return Math.min(1,(Maths.maxminRandom(5, 3) + mod)/10);
  }

  static hide() {

  }
}
