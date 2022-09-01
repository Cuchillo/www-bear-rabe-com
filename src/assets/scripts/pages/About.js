import Page from '../_app/cuchillo/pages/Page';
import Default from './Default';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';
import Header from '../layout/Header';
import BackgroundLogo from '../components/BackgroundLogo';
import Main from '../main';
import BG from '../_app/cuchillo/layout/Background';
import { SliderScroll } from '../_app/cuchillo/components/SliderScroll';
import VisorVideos from '../components/VisorVideo';
import { isSmartphone } from '../_app/cuchillo/core/Basics';
import { Scroll } from '../_app/cuchillo/scroll/Scroll';


export default class About extends Default {

  _billboard;
  _slider;
  _visorVideos;
  
  constructor() {
    super();
    this._visorVideos = new VisorVideos(GetBy.class("__blockVideos", this.container)[0]);
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
    /*this._slider = new SliderScroll(document.getElementById("SliderPhotos"), {
        onDragStart: () => { },
        onDragEnd: () => { },
        interaction: true,
        hasScrollbar: false
    });*/

    this._visorVideos.play();
  }

  show__effect(__call) {
    Wrap.directShow();  
    
    if(!isSmartphone) {
      BackgroundLogo.setRabe();
      BackgroundLogo.show();
    } else {
      BackgroundLogo.hide();
    }

    setTimeout(()=> {
      this._billboard.show();
      Header.show();
     },400);
    
    this.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Header.hide();
    BackgroundLogo.hide();
    Scroll.goto(0);

    this._billboard.hide();
    setTimeout(()=> {
      Wrap.directHide();
      this.afterHide();
    },1000)
    
  }

  //DISPOSE
  dispose() {
    Main.scene.stop();
    //this._slider.dispose();
    this._billboard.dispose();
    this._visorVideos.dispose();
    super.dispose();
  }

  //RESIZE
  resize() {
    super.resize();
   // this._slider.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();

     // this._slider.step(Scroll.speed * 5);

      //this._slider.loop();
      this._visorVideos.loop();
    }
  }
}

ControllerPage._addPage("about", About)
