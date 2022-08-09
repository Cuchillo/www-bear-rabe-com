import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';
import Header from '../layout/Header';
import BackgroundLogo from '../components/BackgroundLogo';
import Main from '../main';
import BG from '../_app/cuchillo/layout/Background';
import EventDispatcher from '../_app/cuchillo/core/EventDispatcher';


export default class Home extends Page {

  _billboard;
  _scene;
  _visor;

  constructor() {
    super();
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
    this._visor = new VisorImage(GetBy.class("__visorProjects", this.container)[0]);

    this.addDispose(()=>this._billboard.dispose());
  }

  _setupColor(){
    if(this.isFirstTime) {
      super._setupColor();
    }
  }
  _show() {
    if(this.isFirstTime) {
      EventDispatcher.dispatchEvent(Page.ON_SHOW);
      BG.changePalette("secondary", null, 0)
      this.show__effect();
    } else {
      super._show();
    }
  }

  //SHOW
  beforeShow() {
    if(!this.isFirstTime) {
      Main.scene.start();
    }
  }

  show__effect(__call) {
    if(this.isFirstTime) {

      Wrap.directShow();
      Header.show();
      this._billboard.show(()=> {
        
        Main.scene.start();
        BG.changePalette("primary", null, 0)
        Main.scene.show();
        Main.scene.showParticles();  
        BG.changeBG("#FFFFFF", null, 0);
        BackgroundLogo.setBlack();
        BackgroundLogo.setInverted();
        BackgroundLogo.show();
      });

    } else {
      Wrap.directShow();
      Main.scene.show();
      Main.scene.showParticles();

      BG.changePalette("primary", null, 0)

      BackgroundLogo.setBlack();
      BackgroundLogo.setInverted();
      BackgroundLogo.show();

      setTimeout(()=> {
        this._billboard.show();
        Header.show();
      },400);
    }

    /*Main.scene.show();
    Main.scene.showParticles();


    BG.changePalette("palette-secondary", null, 0)

    BG.changeBG("#FFFFFF", null, 0);
    BackgroundLogo.setBlack();
    BackgroundLogo.setInverted();
    BackgroundLogo.show();

    setTimeout(()=> {
      this._billboard.show();
      Header.show();
     },400);*/
    
    this.afterShow();
  }

  showText() {
    this._billboard.show();
    setTimeout(()=> {this.hidetext()}, 4000);
  }

  hidetext() {
    this._billboard.hide();
    setTimeout(()=> {this.showText()}, 4000);
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    this._visor.isEnabled = false;
    Header.hide();
    BackgroundLogo.hide();
    Main.scene.hide();
    this._billboard.hide();
    setTimeout(()=> {
      Wrap.directHide();
      this.afterHide();
    },1000)
    
  }

  afterHide() {
    super.afterHide();
  }

  //DISPOSE
  dispose() {
    Main.scene.stop();
    this._billboard.dispose();
    super.dispose();
  }

  //RESIZE
  resize() {
    super.resize();
    this._visor.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
      this._visor.loop();
    }
  }
}

ControllerPage._addPage("home", Home)
