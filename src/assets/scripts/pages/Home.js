import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';
import Header from '../layout/Header';
import BackgroundLogo from '../components/BackgroundLogo';
import Scene from '../3D/Scene';


export default class Home extends Page {

  _billboard;
  _scene;
  _visor;

  constructor() {
    super();
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
    this._scene = new Scene();
    this._visor = new VisorImage(GetBy.class("__visorProjects", this.container)[0]);

    this.addDispose(()=>this._billboard.dispose());
  }

  //SHOW
  beforeShow() {
    this._scene.start();
  }

  show__effect(__call) {
    Wrap.directShow();
    BackgroundLogo.show();
    this._billboard.show();
    Header.show();
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
    this._scene.stop();
    this._scene.dispose();
    this._billboard.dispose();
    super.dispose();
  }

  //RESIZE
  resize() {
    super.resize();
    this._visor.resize();
    this._scene.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
      this._scene.loop();
      this._visor.loop();
    }
  }
}

ControllerPage._addPage("home", Home)
