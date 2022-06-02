import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import BillboardText from '../components/BillboardText';
import { GetBy } from '../_app/cuchillo/core/Element';
import VisorImage from '../components/VisorImage';
import Header from '../layout/Header';


export default class Home extends Page {

  _billboard;
  _visor;

  constructor() {
    super();
    this._billboard = new BillboardText(GetBy.class("__billboard", this.container)[0]);
    this._visor = new VisorImage(GetBy.class("__visorProjects", this.container)[0]);

    this.addDispose(()=>this._billboard.dispose());
  }

  //SHOW
  beforeShow() {}

  show__effect(__call) {
    Wrap.directShow();
    this._billboard.show();
    Header.show();
    this.afterShow();
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Header.hide();
    this._billboard.hide();
    setTimeout(()=> {
      Wrap.directHide();
      this.afterHide();
    },1000)
    
  }

  afterHide() {
    super.afterHide();
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
