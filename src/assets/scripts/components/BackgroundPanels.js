import { GetBy } from "../_app/cuchillo/core/Element";
import { gsap, Power2 } from "gsap";
import { Functions } from "../_app/cuchillo/utils/Functions";
import { Ease } from "../_app/cuchillo/utils/Ease";
import { Basics } from "../_app/cuchillo/core/Basics";
import { Maths } from "../_app/cuchillo/utils/Maths";


export default class BackgroundPanels {
  static maxSteps = 10;

  static options = {
    steps: 12,
    timeInit: 10,
    timeInc: 20,
  }

  static panels = [...GetBy.selector("[data-bg-panel]")];
  static colors = ["--blue", "--green", "--grey"];
  static positionsH = [0,100,50];
  static positionsV = [0,100,50];
  static origins = [
    {x:0,y:50},
    {x:50,y:100},
  ];
  static posV = 50;
  static _steps;
  static _cont;
  static _call;
  static _isInfinite = false;
  static _isRunning = false;

  static show(__call, __isInfinite = false) {
    this._cont = 0;
    this._steps = 0;
    this._isInfinite = __isInfinite;
    this._call = __call;

    if(!this._isRunning) {
      this.colors = Functions.arrayRandom(this.colors);
      this.positionsH = Functions.arrayRandom(this.positionsH);
      this.positionsV = Functions.arrayRandom(this.positionsV);
      this.showPanel(this.panels[0], 0);
      this.showPanel(this.panels[1], 1);
      this.loop();
    }
  }

  static loop() {
    this._cont++;
    this._steps++;
    this._isRunning = true;

    if(this._cont%2 === 0) {
      this.colors = Functions.arrayRandom(this.colors);
    }

    if(this._cont%2 === 0) {
      this.positionsH = Functions.arrayRandom(this.positionsH);
      this.positionsV = Functions.arrayRandom(this.positionsV);      
    }
    
    this.showPanel(this.panels[0], 0);
    this.showPanel(this.panels[1], 1);

    if(this._steps != this.options.steps || this._isInfinite) {
      setTimeout(()=> {
        this.loop();
        if(this._call) this._call(this.colors[2]);
      }, this.options.timeInit + (this.options.timeInc * this._cont));
    } else {
      if(this._call) this._call(this.colors[2]);
      this._isRunning = false;
      this._call = null;
    }
  }

  static showPanel(__panel, __index) {
    __panel.removeAttribute("class");
    __panel.classList.add(this.colors[__index]);

    const v1 = this.getVal(10);
    const v2 = this.getVal(v1==1? 0 : 10);
    const position = Functions.arrayRandom([v1,v2]);

    gsap.to(this.origins[__index],{
      x:this.positionsH[__index], 
      y:this.positionsV[__index], 
      duration: 1,
      ease: this._cont === 1? Power2.easeIn : Power2.easeOut
    });

    gsap.to(__panel,{
      scaleX:position[0], 
      scaleY:position[1], 
      duration: 1,
      ease: this._cont === 1? Power2.easeIn : Power2.easeOut,
      onUpdate:()=> {
        __panel.style.transformOrigin =  `${this.origins[__index].x}% ${this.origins[__index].y}%` 
      }
    });
  }

  static hidePanel(__panel, __index) {
    __panel.removeAttribute("class");

    const v1 = this.getVal(10);
    const v2 = this.getVal(v1==1? 0 : 10);
    const position = Functions.arrayRandom([v1,v2]);

    gsap.to(this.origins[__index],{
      x:this.positionsH[__index], 
      y:this.positionsV[__index], 
      duration: 1,
      ease: Power2.easeOut
    });

    gsap.to(__panel,{
      scaleX:position[0], 
      scaleY:position[1], 
      duration: 1,
      ease: Power2.easeOut,
      onUpdate:()=> {
        __panel.style.transformOrigin =  `${this.origins[__index].x}% ${this.origins[__index].y}%` 
      }
    });
  }

  static getVal(__n100 = 0) {
    const mod = Maths.maxminRandom(__n100, 0) > 5? 10 : 0;
    return Math.min(1,(Maths.maxminRandom(5, 3) + mod)/10);
  }

  static hide() {
    this.hidePanel(this.panels[0], 0);
    this.hidePanel(this.panels[1], 1);
  }
}
