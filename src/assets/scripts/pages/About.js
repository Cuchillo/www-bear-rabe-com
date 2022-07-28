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


export default class About extends Default {

  _billboard;
  _slider;
  
  constructor() {
    super();
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
    this._slider = new SliderScroll(document.getElementById("SliderPhotos"), {
        onDragStart: () => { },
        onDragEnd: () => { },
        interaction: true,
        hasScrollbar: false
    });
  }

  show__effect(__call) {
    Wrap.directShow();  
    BackgroundLogo.setRabe();
    BackgroundLogo.show();

    setTimeout(()=> {
      this._billboard.show();
      Header.show();
     },400);
    
    this.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    this._visor.isEnabled = false;
    Header.hide();
    BackgroundLogo.hide();

    this._billboard.hide();
    setTimeout(()=> {
      Wrap.directHide();
      this.afterHide();
    },1000)
    
  }

  //DISPOSE
  dispose() {
    Main.scene.stop();
    this._slider.dispose();
    this._billboard.dispose();
    super.dispose();
  }

  //RESIZE
  resize() {
    super.resize();
    this._slider.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
      this._slider.loop();
    }
  }
}

ControllerPage._addPage("about", About)
